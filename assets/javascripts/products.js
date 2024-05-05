import { EverREST } from "./everrest-service.js";
import { displayAlert } from "./alert-service.js";

const paginationDisplay = document.querySelector("#paginationDisplay");
const productsDisplay = document.querySelector("#displayProducts");

const everREST = new EverREST();

const config = {
  limit: 5,
  page: 1,
  skip: 0,
  total: 0,
  max: 0,
  cache: [],
};

initPagination();

async function initPagination() {
  const response = await everREST.getProducts(config.page, config.limit);
  updateConfig(response);
  displayPagination();
  displayProducts(1);
}

function updateConfig(response) {
  const { limit, page, skip, total, products } = response;
  config.limit = limit;
  config.page = page;
  config.total = total;
  config.skip = skip;
  config.max = Math.ceil(total / limit);
  config.cache.push({
    products,
    index: page,
  });
}

function displayPagination() {
  const fragment = document.createDocumentFragment();
  const prev = document.createElement("li");
  prev.classList.add("page-item");
  prev.setAttribute("data-paginate-item", "");
  prev.innerHTML = '<span class="page-link">Previous</span>';
  fragment.appendChild(prev);
  for (let i = 1; i <= Math.ceil(config.total / config.limit); i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");
    li.setAttribute("data-paginate-item", "");
    if (i === 1) {
      li.classList.add("active");
    }
    li.innerHTML = `<span class="page-link">${i}</span>`;
    fragment.appendChild(li);
  }
  const next = document.createElement("li");
  next.setAttribute("data-paginate-item", "");
  next.classList.add("page-item");
  next.innerHTML = '<span class="page-link">Next</span>';
  fragment.appendChild(next);

  for (let i = 0; i < fragment.children.length; i++) {
    const node = fragment.children[i];
    node.addEventListener("click", () => {
      let index = i;

      if (i === 0 || i === config.max + 1) {
        index = i === 0 ? config.page - 1 : config.page + 1;
      }

      paginate(index);
    });
  }

  paginationDisplay.appendChild(fragment);
}

function paginate(index) {
  if (index <= 0 || index > config.max) {
    return;
  }
  config.page = index;
  updatePaginateItem(index);
  displayProducts(index);
}

function updatePaginateItem(index) {
  document.querySelectorAll("li[data-paginate-item]").forEach((item, i) => {
    item.classList.remove("active");

    if (index === i) {
      item.classList.add("active");
    }
  });
}

function displayProducts(index) {
  const cachedItems = config.cache.find((item) => item.index === index);

  if (!cachedItems) {
    loadProduct(index);
    return;
  }

  productsDisplay.innerHTML = "";
  cachedItems.products.forEach((product) => {
    productsDisplay.innerHTML += everREST.getProductUI(product);
  });
}

async function loadProduct(index) {
  const response = await everREST.getProducts(index, config.limit);
  updateConfig(response);
  displayProducts(index);
}

/*
  დავალება:
  არსებულ კოდში დაარედაქტირეთ getProductUI() მეთოდი, სადაც შედარებით
  უფრო მეტ ინფორმაციას გამოიტანოთ ვიზუალზე.
*/
