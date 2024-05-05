export class EverREST {
  constructor(baseURL = "https://api.everrest.educata.dev") {
    this.baseURL = baseURL;
  }

  xhrRequest(method, endpoint, body = {}) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${this.baseURL}/${endpoint}`);
    if (method !== "GET") {
      xhr.setRequestHeader("Content-Type", "application/json");
    }
    xhr.send(JSON.stringify(body));
    return new Promise((resolve, reject) => {
      xhr.onerror = () => {
        reject(JSON.parse(xhr.responseText));
      };
      xhr.onload = () => {
        if (xhr.status >= 400) {
          reject(JSON.parse(xhr.responseText));
        }
        resolve(JSON.parse(xhr.responseText));
      };
    });
  }

  generateQrCode(text) {
    return this.xhrRequest("POST", "qrcode/generate", { text });
  }

  getProducts(pageIndex = 1, pageSize = 5) {
    return this.xhrRequest(
      "GET",
      `shop/products/all?page_index=${pageIndex}&page_size=${pageSize}`
    );
  }

  getProductUI(product) {
    // Function to convert rating into star icons
    const getStarRating = (rating) => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5 ? 1 : 0;
      const emptyStars = 5 - fullStars - halfStar;
      return (
        "★".repeat(fullStars) + "½".repeat(halfStar) + "☆".repeat(emptyStars)
      );
    };

    // Function to generate a random price between 100 and 1000
    const getRandomPrice = () => {
      return (Math.floor(Math.random() * (1001 - 100)) + 100).toFixed(2);
    };

    const price = getRandomPrice(); // Generate a random price for this product

    return `
      <div class="card" style="width: 18rem; margin-bottom: 20px;">
        <img src="${
          product.thumbnail
        }" class="card-img-top" alt="Product Image">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <div class="product-info">
            <span class="rating">Rating: ${getStarRating(
              product.rating
            )} (${product.rating.toFixed(1)} / 5)</span>
            <span class="price">Price: $${price}</span>
          </div>
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    `;
  }
}
