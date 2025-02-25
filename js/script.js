document.addEventListener("DOMContentLoaded", () => {
    const auctionContainer = document.getElementById("auction-container");

    // Sample auctions data
    const auctions = [
        { id: 1, title: "Vintage Watch", price: "$200", timeLeft: "2h 30m" },
        { id: 2, title: "Antique Vase", price: "$500", timeLeft: "1h 15m" },
        { id: 3, title: "Classic Car Model", price: "$1200", timeLeft: "4h 50m" },
        { id: 4, title: "Artwork", price: "$800", timeLeft: "3h 20m" }
    ];

    // Render auctions dynamically
    function renderAuctions() {
        auctionContainer.innerHTML = "";
        auctions.forEach(auction => {
            const auctionElement = document.createElement("div");
            auctionElement.classList.add("auction-item");
            auctionElement.innerHTML = `
                <h3>${auction.title}</h3>
                <p>Current Bid: ${auction.price}</p>
                <p>Time Left: ${auction.timeLeft}</p>
                <button class = "placebid" onclick="placeBid(${auction.id})">Place Bid</button>
            `;
            auctionContainer.appendChild(auctionElement);
        });
    }

    // Placeholder function for bidding
    window.placeBid = function(auctionId) {
        alert(`Bid placed on auction ID: ${auctionId}`);
    }

    renderAuctions();
});