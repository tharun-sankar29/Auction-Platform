const fetchAuctions = async (auction_type) => {
    try {
        const end_point = auction_type === "all" ? '/auctions/all' : '/auctions/featured';
        const response = await fetch(end_point);

        const auctions = await response.json();
        const container = document.getElementById('auction-container');
        container.innerHTML = '';

        if (auctions.length === 0) {
            container.innerHTML = `<p>No auctions found...</p>`;
            return;
        }

        auctions.forEach(auction => {
            const auctionElement = document.createElement('div');
            auctionElement.classList.add('auction-item');

            // Extracting bid info (current highest bid)
            const currentPrice = auction.bids.length > 0 
                ? Math.max(...auction.bids.map(bid => bid.amount))   // Get the highest bid
                : auction.price;                                      // Fallback to starting price

            auctionElement.innerHTML = `
                <h2 class="auction-item-title">${auction.title}</h2>
                <img src="${auction.img}" alt="${auction.title}" style="width: 100%; max-height: 300px;">
                <p>${auction.description}</p>
                <p>Starting Price: $${auction.price}</p>
                <p>Current Price: $${currentPrice}</p>
                <p>Ends: ${new Date(auction.end_time).toLocaleString()}</p>
                <button class="view-details-btn" onclick="window.location.href='item-details.html?id=${auction._id}'">View Details</button>
            `;

            container.appendChild(auctionElement);
        });

    } catch (err) {
        console.error('Error fetching auctions:', err);
    }
};

// After rendering all auctions

