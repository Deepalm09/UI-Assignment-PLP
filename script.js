const apiEndpoint = 'https://fakestoreapi.com/products';
let products = [];
let filteredProducts = [];
let categories = new Set();
let currentPage = 0;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");
  fetchProducts();
  document.getElementById('load-more').addEventListener('click', loadMoreProducts);
  document.getElementById('search').addEventListener('input', searchProducts);
  document.getElementById('category-filter').addEventListener('change', filterByCategory);
  document.getElementById('sort').addEventListener('change', sortProducts);
 
});

function fetchProducts() {
  console.log("Fetching products...");
  fetch(apiEndpoint)
    .then(response => response.json())
    .then(data => {
      console.log("Products fetched:", data);
      products = data;
      filteredProducts = data;
      populateCategories(data);
      displayProducts();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const loadingIndicator = document.getElementById('loading');
      if (loadingIndicator) {
        loadingIndicator.innerText = 'Error loading products.';
      }
    });
}

function populateCategories(products) {
  products.forEach(product => categories.add(product.category));
  const categoryFilter = document.getElementById('category-filter');
  categories.forEach(category => {
    const checkbox = document.createElement('div');
    checkbox.className = 'category-checkbox';
    checkbox.innerHTML = `
      <input type="checkbox" id="${category}" value="${category}" onchange="filterByCategory(event)">
      <label for="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</label>
    `;
    categoryFilter.appendChild(checkbox);
  });
  console.log("Categories populated:", Array.from(categories));
}

function displayProducts() {
  console.log("Displaying products...");
  const productContainer = document.getElementById('product-list');
  const loadingIndicator = document.getElementById('loading');
  const start = currentPage * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToDisplay = filteredProducts.slice(start, end);

  console.log("Products to display:", productsToDisplay);

  productsToDisplay.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2>${product.title}</h2>
      <p>$${product.price}</p>
      <p>${product.description}</p>
    `;
    productContainer.appendChild(productElement);
  });

  currentPage++;
  if (loadingIndicator) {
    loadingIndicator.style.display = 'none';
  }

  if (currentPage * itemsPerPage >= filteredProducts.length) {
    document.getElementById('load-more').style.display = 'none';
  } else {
    document.getElementById('load-more').style.display = 'block';
  }
}

function loadMoreProducts() {
  displayProducts();
}

function searchProducts(event) {
  const query = event.target.value.toLowerCase();
  filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(query) || 
    product.description.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query)
  );

  const productList = document.getElementById('product-list');
  if (productList) {
    productList.innerHTML = '';
    currentPage = 0;
    displayProducts();
  }
}

function sortProducts(event) {
  const sortValue = event.target.value;
  if (sortValue === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const productList = document.getElementById('product-list');
  if (productList) {
    productList.innerHTML = '';
    currentPage = 0;
    displayProducts();
  }
}

function filterByCategory(event) {
  const checkboxes = document.querySelectorAll('#category-filter input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    if (checkbox !== event.target) {
      checkbox.checked = false;
    }
  });

  const checkedCategory = event.target.checked ? event.target.value : '';
  if (checkedCategory === '') {
    filteredProducts = products;
  } else {
    filteredProducts = products.filter(product => product.category === checkedCategory);
  }

  const productList = document.getElementById('product-list');
  if (productList) {
    productList.innerHTML = '';
    currentPage = 0;
    displayProducts();
  }
}

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {

  /* Toggle active class */
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");

  /* Toggle aria-expanded value */
  let menuOpen = navMenu.classList.contains("active");
  console.log(menuOpen)
  let newMenuOpenStatus = menuOpen;
  hamburger.setAttribute("aria-expanded", newMenuOpenStatus);
})

// close mobile menu
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
//   Need to add Toggle aria-expanded value here as well because it stays as true when you click a menu item
}))