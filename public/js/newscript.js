window.renderAuctions  = function(auction_type) {
    const container = document.getElementById("auction-container");
    container.innerHTML = '';

    let auctions;
    const allauctions = [
        { id: 1, title: "Vintage Watch", price: "$200", timeLeft: "2h 30m" },
        { id: 2, title: "Antique Vase", price: "$500", timeLeft: "1h 15m" },
        { id: 3, title: "Classic Car Model", price: "$1200", timeLeft: "4h 50m" },
        { id: 4, title: "Artwork", price: "$800", timeLeft: "3h 20m" },
        { id: 5, title: "Mobile Phone", price: "$400", timeLeft: "5hr 35m"}
    ];

    const featuredAuctions = [
        { id: 1, title: "Vintage Watch", price: "$200", timeLeft: "2h 30m" },
        { id: 2, title: "Antique Vase", price: "$500", timeLeft: "1h 15m" },
        { id: 3, title: "Classic Car Model", price: "$1200", timeLeft: "4h 50m" }
    ];
    
    if (auction_type === 'featured') {
        auctions = featuredAuctions;
    } else if (auction_type === 'all') {
        auctions = allauctions;
    }

    auctions.forEach(auction => {
        const auctionElement = document.createElement('div');
        auctionElement.classList.add("auction-item");
        auctionElement.innerHTML = `
            <h3 class = "auction-item-title">${auction.title}</h3>
            <img src="/images/auction-items/${auction.id}.jpg">
            <p>Current Bid: ${auction.price}</p>
            <p>Time Left: ${auction.timeLeft}</p>
            <button class="placebid" onclick="placeBid(${auction.id})">Place Bid</button>
        `;

        auctionElement.addEventListener('click', () => {
            window.location.href = `item-details.html?auction_id=${auction.id}`;
        });
        container.appendChild(auctionElement);
    });
}