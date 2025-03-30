window.renderProductPage = async function(auction_id) {
    try {
        // ✅ Fetch auction details from MongoDB
        const res = await fetch(`/auctions/${auction_id}`);
        if (!res.ok) {
            throw new Error('Failed to fetch auction details');
        }

        const auction = await res.json();

        const productContainer = document.getElementById("product-container");
        productContainer.innerHTML = `
            <h2>${auction.title}</h2>
            <img src="${auction.img}" alt="${auction.title}" style="width: 100%; max-height: 300px;">
            <p id="currentBid">Current Bid: $${auction.bids.length > 0 
                ? Math.max(...auction.bids.map(bid => bid.amount)) 
                : auction.price}</p>
            <p>Time Left: <span id="timeLeft">${getTimeLeft(auction.end_time)}</span></p>
            <button class="add-review" onclick="window.location.href='review.html?auction_id=${auction._id}'">Add Review</button>
            <button id="placeBidButton" class="placebid">Place Bid</button>
            <div id="bidModal" style="display:none;">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Place Bid</h2>
                    <input id="bidAmount" type="number" placeholder="Enter bid amount">
                    <button id="submitBid">Submit Bid</button>
                </div>
            </div>
        `;

        // ✅ Handle Modal Opening/Closing
        document.getElementById('placeBidButton').onclick = () => {
            document.getElementById('bidModal').style.display = 'block';
        };

        document.querySelector('.close').onclick = () => {
            document.getElementById('bidModal').style.display = 'none';
        };

        // ✅ Dynamic Time Countdown
        const endTime = new Date(auction.end_time).getTime();
        const timer = setInterval(() => {
            const currentTime = Date.now();
            const remainingTime = endTime - currentTime;

            if (remainingTime <= 0) {
                document.getElementById('timeLeft').textContent = 'Bid ended';
                clearInterval(timer);
                return;
            }

            document.getElementById('timeLeft').textContent = getTimeLeft(auction.end_time);
        }, 1000);

        // ✅ Bid Submission with Backend Integration
        document.getElementById('submitBid').onclick = async () => {
            const bidAmount = parseFloat(document.getElementById('bidAmount').value);

            const highestBid = auction.bids.length > 0
                ? Math.max(...auction.bids.map(bid => bid.amount))
                : auction.price;

            if (bidAmount <= highestBid) {
                alert('New bid must be higher than the current bid.');
                return;
            }

            const bidResponse = await fetch(`/auctions/${auction._id}/bid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    user_id: '660aabb88fb8c32244b49b20',   // Replace with actual user ID
                    amount: bidAmount 
                })
            });

            if (bidResponse.ok) {
                alert('Bid placed successfully!');
                window.location.reload();
            } else {
                alert('Failed to place bid.');
            }
        };

    } catch (error) {
        console.error('Error loading auction:', error);  // ✅ Fixed: Correct error reference
    }
};

// ✅ Function to calculate remaining time
const getTimeLeft = (endTime) => {
    const remainingTime = new Date(endTime) - new Date();
    if (remainingTime <= 0) return 'Bid ended';
    
    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};
