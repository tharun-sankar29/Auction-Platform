const auctions = [
    { id: 1, title: "Vintage Watch", price: "$200", timeLeft: "2h 30m" },
    { id: 2, title: "Antique Vase", price: "$500", timeLeft: "1h 15m" },
    { id: 3, title: "Classic Car Model", price: "$1200", timeLeft: "4h 50m" },
    { id: 4, title: "Artwork", price: "$800", timeLeft: "3h 20m" },
    { id: 5, title: "Mobile Phone", price: "$400", timeLeft: "5hr 35m"}
];

window.renderProductPage = function(auction_id) {
    const auction = auctions.find(a => a.id === auction_id);
    if (!auction) {
        alert("Auction not found");
        return;
    }
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = `
        <h2>${auction.title}</h2>
        <img src="images/auction-items/${auction.id}.jpg">
        <p>Current Bid: ${auction.price}</p>
        <p>Time Left: ${auction.timeLeft}</p>
        <button class = "add-review" onclick="window.location.href='review.html?auction_id=${auction.id}'">Add Review</button>
        <button id="placeBidButton" class = "placebid">Place Bid</button>
        <div id="bidModal" style="display:none;">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Place Bid</h2>
                <input id="bidAmount" type="number" placeholder="Enter bid amount">
                <button id="submitBid">Submit Bid</button>
            </div>
        </div>
    `;
    document.getElementById('placeBidButton').onclick = function() {
        document.getElementById('bidModal').style.display = 'block';
    };

    document.querySelector('.close').onclick = function() {
        document.getElementById('bidModal').style.display = 'none';
    };

    document.getElementById('submitBid').onclick = function() {
        const bidAmount = document.getElementById('bidAmount').value;
        alert(`Bid of ${bidAmount} submitted!`);
        document.getElementById('bidModal').style.display = 'none';
    };
}
