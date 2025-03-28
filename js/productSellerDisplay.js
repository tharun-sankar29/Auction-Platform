document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  
    function fetchProducts() {
      fetch('/products')
        .then(response => response.json())
        .then(products => renderProducts(products))
        .catch(error => console.error('Error fetching products:', error));
    }
    //I think it's wrong. I will check later
    function renderProducts(products) {
      const container = document.getElementById('product-container');
      container.innerHTML = ''; 
      products.forEach(product => {
        const productHTML = `
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
        container.innerHTML += productHTML;
      });
    }
  });