const fetchAuctions = async () => {
    try {
        const response = await fetch('/auctions/all');
        if (!response.ok) {
            throw new Error('Failed to fetch auctions');
        }


        const auctions = await response.json();
        const container = document.getElementById('auction-container');
        container.innerHTML = '';

        if (auctions.length === 0) {
            container.innerHTML = `<p>No auctions Found..`;
            return;
        }

        auctions.forEach(auction => {
            const auctionElement = document.createElement('div');
            auctionElement.classList.add('auction-item');

            auctionElement.innerHTML = `<h2>${auction.title}</h2>
                <img src="${auction.image_url}" alt="${auction.title}" style="width: 100%; max-height: 300px;">
                <p>${auction.description}</p>
                <p>Starting Price: $${auction.starting_price}</p>
                <p>Current Price: $${auction.current_price}</p>
                <p>Ends: ${new Date(auction.end_time).toLocaleString()}</p>
                <button onclick="window.location.href='auction-item.html?id=${auction._id}'">View Details</button>
            `;

            container.appendChild(auctionElement);

        
        });


    } catch (err) {

    }
}