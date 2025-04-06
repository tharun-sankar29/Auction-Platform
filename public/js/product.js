window.renderProductPage = async function(auction_id) {
    try {
        const res = await fetch(`/auctions/${auction_id}`);
        if (!res.ok) throw new Error('Failed to fetch auction details');

        const auction = await res.json();
        const productContainer = document.getElementById("product-container");

        // ✅ Render auction data including the "Place Bid" button
        productContainer.innerHTML = `
            <h2>${auction.title}</h2>
            <img src="${auction.img}" alt="${auction.title}" style="width: 100%; max-height: 300px;">
            <p id="currentBid">Current Bid: $${auction.bids.length > 0 
                ? Math.max(...auction.bids.map(bid => bid.amount)) 
                : auction.price}</p>
            <p>Time Left: <span id="timeLeft"></span></p>
            <button class="add-review" onclick="window.location.href='review.html?id=${auction._id}'">Add Review</button>
            <button class="view-review" onclick="window.location.href='feedback.ejs.html?id=${auction._id}'">View Review</button>
            <button id="placeBidButton" class="placebid">Place Bid</button>
        `;

        // ✅ Timer Countdown
        const endTime = new Date(auction.end_time).getTime();
        const timeLeftElement = document.getElementById('timeLeft');

        const timer = setInterval(() => {
            const now = Date.now();
            const diff = endTime - now;

            if (diff <= 0) {
                timeLeftElement.textContent = 'Bid ended';
                clearInterval(timer);
                return;
            }

            timeLeftElement.textContent = getTimeLeft(diff);
        }, 1000);

        // ✅ Modal Controls
// ✅ Add AFTER productContainer.innerHTML = `...` block

setTimeout(() => {
    const bidModal = document.getElementById('bidModal');
    const placeBidButton = document.getElementById('placeBidButton');
    const closeButton = bidModal.querySelector('.close');
    const submitBidButton = document.getElementById('submitBid');

    // If button exists, attach events
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'placeBidButton') {
            bidModal.style.display = 'flex';
        }
    });
    

    if (closeButton) {
        closeButton.onclick = () => {
            bidModal.style.display = 'none';
        };
    }

    if (submitBidButton) {
        submitBidButton.onclick = () => submitBid(auction);
    }
}, 5);


    } catch (error) {
        console.error('Error loading auction:', error);
    }
};

function getTimeLeft(ms) {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
}

async function submitBid(auction) {
    const bidAmount = parseFloat(document.getElementById('bidAmount').value);
    const highestBid = auction.bids.length > 0
        ? Math.max(...auction.bids.map(bid => bid.amount))
        : auction.price;

    if (bidAmount <= highestBid) {
        alert('New bid must be higher than current bid.');
        return;
    }

    try {
        const sessionRes = await fetch('/auth/session');
        if (!sessionRes.ok) {
            alert('Session expired. Please log in.');
            window.location.href = '/loginAndRegister.html';
            return;
        }

        const { user_id } = await sessionRes.json();

        const bidRes = await fetch(`/auctions/${auction._id}/bid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, amount: bidAmount })
        });

        if (bidRes.ok) {
            alert('Bid placed successfully!');
            window.location.reload();
        } else {
            const error = await bidRes.json();
            alert(`Error: ${error.message}`);
        }

    } catch (err) {
        console.error('Error submitting bid:', err);
        alert('Something went wrong while placing bid.');
    }
}
