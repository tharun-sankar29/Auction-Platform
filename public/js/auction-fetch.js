const fetchAuctions = async (searchTerm = "all") => {
    try {
        const endpoint = searchTerm === "featured"
            ? '/auctions/featured'
            : `/auctions?search=${encodeURIComponent(searchTerm)}`;
            
        const response = await fetch(endpoint);
        const auctions = await response.json();
        const container = document.getElementById('auction-container');
        container.innerHTML = '';

        if (!auctions || auctions.length === 0) {
            container.innerHTML = `<p>No auctions found...</p>`;
            return;
        }

        auctions.forEach(auction => {
            const auctionElement = document.createElement('div');
            auctionElement.classList.add('auction-item');

            const currentPrice = auction.bids.length > 0 
                ? Math.max(...auction.bids.map(bid => bid.amount))
                : auction.price;

            auctionElement.innerHTML = `
                <h2 class="auction-item-title">${auction.title}</h2>
                <div class="image-container">
                    <img class="auction-image" src="${auction.img}" alt="${auction.title}">
                </div>
                <div class="auction-description">
                    <p>${auction.description}</p>
                    <p>Starting Price: $${auction.price}</p>
                    <p>Current Price: $${currentPrice}</p>
                    <p>Ends: ${new Date(auction.end_time).toLocaleString()}</p>
                </div>
                <button class="view-details-btn" onclick="window.location.href='item-details.html?id=${auction._id}'">View Details</button>
            `;

            container.appendChild(auctionElement);
        });

    } catch (err) {
        console.error('Error fetching auctions:', err);
    }
};



document.addEventListener('DOMContentLoaded', () => {
    fetchAuctions("featured"); // now works properly!
});


document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search').value.trim();
    fetchAuctions(searchInput || "all"); // fallback to "all" if input is empty
});

// Also allow Enter key to trigger search
document.getElementById('search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('search-button').click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    fetchAuctions("all");
});

