const auctions = [
    { id: 1, title: "Vintage Watch", price: "$200", timeLeft: "2h 30m 30s" },
    { id: 2, title: "Antique Vase", price: "$500", timeLeft: "1h 15m 30s" },
    { id: 3, title: "Classic Car Model", price: "$1200", timeLeft: "4h 50m 30s" },
    { id: 4, title: "Artwork", price: "$800", timeLeft: "3h 20m 30s" },
    { id: 5, title: "Mobile Phone", price: "$400", timeLeft: "5hr 35m 30s"}
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
        <p id="currentBid">Current Bid: ${auction.price}</p>
        <p>Time Left:<p id="timeLeft"> ${auction.timeLeft}</p></p>
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
    //getting current time
    const StartTime = document.getElementById('timeLeft').textContent;
    const hourArr = StartTime.split('h');
    const hours = String(hourArr[0]).trim();
    const minuteString = String(hourArr[1]);
    const minArr = minuteString.split('m');
    const min = String(minArr[0]).trim();
    const seconds = String(minArr[1]).replace('s','').trim();

    //converting to milliseconds
    const milliseconds = (hours * 3600000) + (min * 60000) + (seconds * 1000);
    //getting current time
    const currentTime = Date.now();
    //end time
    const endTime = milliseconds + currentTime;
    //dynamic upgrade of time
    setInterval(function() {
        const currentTime = Date.now();
        //end time
        const remainingTime = endTime - currentTime;
        const newHours = Math.floor(remainingTime / (1000 * 60 * 60));
        const newMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const newSeconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        document.getElementById('timeLeft').textContent = newHours+'h '+newMinutes+'m '+newSeconds+'s';
        if (remainingTime <= 0 ) {
            alert('Bid ended');
        }
    }, 1000)

//changes made - made sure that only bid > current bid can be placed
//Bid changes when update is made
    document.getElementById('submitBid').onclick = function() { 
        const bidAmount = document.getElementById('bidAmount').value;
        const bid = parseFloat(bidAmount);
        const aucprice = parseFloat(auction.price.replace('$',''));
        if (bid <= aucprice) {
            alert('new Bid should be greater than current bid');
        }
        else {
        alert(`Bid of ${bidAmount} submitted!`);
        document.getElementById("currentBid").innerHTML = 'Current Bid: $'+bid; 
        }
            const bidUpdate = document.getElementById('submitBid');
            bidUpdate.addEventListener('click', function(event) {
                document.getElementById("#currentBid").innerHTML = bid;
            })
        document.getElementById('bidModal').style.display = 'none';
    };
}

