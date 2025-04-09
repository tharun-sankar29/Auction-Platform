window.renderProductPage = async function(auction_id) {
    try {
        const res = await fetch(`/auctions/${auction_id}`);
        if (!res.ok) throw new Error('Failed to fetch auction details');

        const auction = await res.json();
        const productContainer = document.getElementById("product-container");
        document.getElementById("product-description").textContent = auction.description;
        document.getElementById("seller-name").textContent = auction.seller_id?.name || "Unknown";
        const reviewsList = document.getElementById('reviews-list');

        auction.feedbacks.forEach(feedback => {
        const div = document.createElement('div');
        div.className = 'review';
        div.innerHTML = `
            <p>⭐ ${feedback.Stars}</p>
            <p>${feedback.description}</p>
            <small>${new Date(feedback.createdAt).toLocaleString()}</small>
        `;
        reviewsList.appendChild(div);
        });



        // ✅ Render auction data including the "Place Bid" button
        productContainer.innerHTML = `
        <h2>${auction.title}</h2>
        <img src="${auction.img}" alt="${auction.title}" style="width: 100%;">
        <p id="currentBid">Current Bid: $${auction.bids.length > 0 
            ? Math.max(...auction.bids.map(bid => bid.amount)) 
            : auction.price}</p>
        <p id="timeLeft"></p> <!-- 👈 Changed this line -->
        <button class="add-review" onclick="window.location.href='review.html?id=${auction._id}'">Add Review</button>
        <button id="placeBidButton" class="placebid">Place Bid</button>
    `;
    

        // ✅ Timer Countdown with Start/End checks
        const startTime = new Date(auction.start_time).getTime();
        const endTime = new Date(auction.end_time).getTime();
        const timeLeftElement = document.getElementById('timeLeft');
        const placeBidButton = document.getElementById('placeBidButton');

        const timer = setInterval(() => {
            const now = Date.now();

            if (now < startTime) {
                const diff = startTime - now;
                timeLeftElement.textContent = `Auction starts in: ${getTimeLeft(diff)}`;
                placeBidButton.disabled = true;
                placeBidButton.textContent = "Auction Not Started";
            } else if (now >= startTime && now < endTime) {
                const diff = endTime - now;
                timeLeftElement.textContent = `Time left: ${getTimeLeft(diff)}`;
                placeBidButton.disabled = false;
                placeBidButton.textContent = "Place Bid";
            } else {
                timeLeftElement.textContent = 'Bid ended';
                placeBidButton.disabled = true;
                placeBidButton.textContent = "Auction Ended";
                clearInterval(timer);
            }
        }, 1000);

        // ✅ Modal Controls (with delay to wait for DOM to update)
        setTimeout(() => {
            const bidModal = document.getElementById('bidModal');
            const closeButton = bidModal.querySelector('.close');
            const submitBidButton = document.getElementById('submitBid');

            document.addEventListener('click', (e) => {
                if (e.target && e.target.id === 'placeBidButton') {
                    if (!placeBidButton.disabled) {
                        bidModal.style.display = 'flex';
                    }
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

    if (isNaN(bidAmount)) {
        alert('Please enter a valid bid amount.');
        return;
    }

    if (bidAmount <= highestBid) {
        alert('Your bid must be higher than the current highest bid.');
        return;
    }

    try {
        const res = await fetch(`/auctions/${auction._id}/bid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: bidAmount })
        });

        if (res.ok) {
            alert('Bid placed successfully!');
            window.location.reload();
        } else {
            const err = await res.json();
            alert(`Error: ${err.message}`);
        }

    } catch (error) {
        console.error('Error submitting bid:', error);
        alert('Something went wrong. Please try again later.');
    }
}
