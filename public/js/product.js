window.renderProductPage = async function(auction_id) {
    try {
        // ✅ Fetch auction details
        const res = await fetch(`/auctions/${auction_id}`);


        if (!res.ok) {
            throw new Error('Failed to fetch auction details');
        }

        const auction = await res.json();

        // ✅ Cache DOM elements for efficiency
        const productContainer = document.getElementById("product-container");
        
        // ✅ Render Auction Details
        productContainer.innerHTML = `
            <h2>${auction.title}</h2>
            <img src="${auction.img}" alt="${auction.title}" style="width: 100%; max-height: 300px;">
            <p id="currentBid">Current Bid: $${auction.bids.length > 0 
                ? Math.max(...auction.bids.map(bid => bid.amount)) 
                : auction.price}</p>
            <p>Time Left: <span id="timeLeft"></span></p>
            <button class="add-review" onclick="window.location.href='review.html?auction_id=${auction._id}'">Add Review</button>
            <button class="view-review" onlcik="window.location.href='feedback.ejs.html?auction_id=${auction._id}''>View Review</button>
            
            <!-- ✅ Place Bid Button -->
            <button id="placeBidButton" class="placebid">Place Bid</button>

            <!-- ✅ Modal for Bid -->
            <div id="bidModal" style="display:none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Place Your Bid</h2>
                    <input id="bidAmount" type="number" placeholder="Enter bid amount" />
                    <button id="submitBid">Submit Bid</button>
                </div>
            </div>
        `;

        // ✅ Add Event Listeners After DOM Rendering
        const placeBidButton = document.getElementById('placeBidButton');
        const bidModal = document.getElementById('bidModal');
        const closeButton = document.querySelector('.close');

        placeBidButton.onclick = () => bidModal.style.display = 'block';
        closeButton.onclick = () => bidModal.style.display = 'none';

        // ✅ Timer Countdown Logic
        const endTime = new Date(auction.end_time).getTime();
        const timeLeftElement = document.getElementById('timeLeft');

        const timer = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = endTime - currentTime;

            if (remainingTime <= 0) {
                timeLeftElement.textContent = 'Bid ended';
                clearInterval(timer);
                return;
            }

            timeLeftElement.textContent = getTimeLeft(remainingTime);
        }, 1000);

        // ✅ Bid Submission with Session User ID
        document.getElementById('submitBid').onclick = () => submitBid(auction);

    } catch (error) {
        console.error('Error loading auction:', error);
    }
};

// ✅ Refined Time Calculation Function
const getTimeLeft = (remainingTime) => {
    if (remainingTime <= 0) return 'Bid ended';

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

// ✅ Refactored Bid Submission Logic with Session User ID
const submitBid = async (auction) => {
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);

    const highestBid = auction.bids.length > 0
        ? Math.max(...auction.bids.map(bid => bid.amount))
        : auction.price;

    if (bidAmount <= highestBid) {
        alert('New bid must be higher than the current bid.');
        return;
    }

    try {
        
        const sessionResponse = await fetch('/auth/session');  // New session route
        if (!sessionResponse.ok) {
            alert('Session expired. Please log in again.');
            window.location.href = '/loginAndRegister.html';
            return;
        }

        const { user_id } = await sessionResponse.json();

        const bidResponse = await fetch(`/auctions/${auction._id}/bid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id,  
                amount: bidAmount
            })
        });

        if (bidResponse.ok) {
            alert('Bid placed successfully!');
            window.location.reload();
        } else {
            const error = await bidResponse.json();
            alert(`Error: ${error.message}`);
        }

    } catch (error) {
        console.error('Bid submission error:', error);
        alert('An error occurred while placing the bid.');
    }
};
