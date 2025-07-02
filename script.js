// Theme toggle
const toggleBtn = document.getElementById("theme-toggle");
if (toggleBtn) {
  toggleBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    toggleBtn.textContent = isDark ? "🌞" : "🌙";
  });

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    toggleBtn.textContent = savedTheme === "dark" ? "🌙" : "🌞";
  }
}

// Carousel
let current = 0;
const slides = document.querySelectorAll(".carousel-img");
if (slides.length > 0) {
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4000);
}

// Enquiry form
const form = document.getElementById("enquiry-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const phone = form.phone?.value || "";
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const data = {
      product: form.product.value,
      email: form.email.value,
      message: form.message.value,
      phone,
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/enquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        alert("Enquiry submitted successfully!");
        form.reset();
      } else {
        alert("Error: " + (result.error || "Failed to submit"));
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  });
}

// Search functionality
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function goToSearchPage(query) {
  if (!query.trim()) return;
  localStorage.setItem("searchQuery", query.trim());
  window.location.href = "products.html";
}

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    goToSearchPage(searchInput.value);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") goToSearchPage(searchInput.value);
  });
}

// Clear query if clicking products link
document.querySelectorAll('a[href="products.html"]').forEach((a) =>
  a.addEventListener("click", () => {
    localStorage.removeItem("searchQuery");
  })
);

// Product List
const products = [
  {
    name: "Lever Lock File",
    images: ["assets/leverlock1.png", "assets/leverlock2.png", "assets/leverlock3.png", "assets/leverlock4.png", "assets/leverlock5.png"],
    description: "High Quality file for A4 documents, perfect for office use.",
  },
  {
    name: "Index File ",
    images: ["assets/indexfile1.png", "assets/indexfile2.png", "assets/indexfile3.png"],
    description: "Durable Index File for A4 documents.",
  },
  {
    name: "High Quality Chain Bag",
    images: ["assets/chainbag1.png", "assets/chainbag2.png"],
    description: "Stylish document holder for everyday use.",
  },
  {
    name: "Plastic Folder",
    images: ["assets/greenmyclearbag.png", "assets/redmyclearbag.png", "assets/whitemyclearbag.png", "assets/yellowmyclearbag.png", "assets/myclearbag.png"],
    description: "High quality plastic folder with button.",
  },
  {
    name: "PVC Box File",
    images: ["assets/pvcboxfile1.png", "assets/pvcboxfile2.png", "assets/pvcboxfile3.png", "assets/pvcboxfile4.png"],
    description: "Durable Box File with a long lasting clip to hold documents.",
  },
  {
    name: "Deluxe Box File",
    images: ["assets/deluxeboxfile1.png", "assets/deluxeboxfile2.png", "assets/deluxeboxfile3.png", "assets/deluxeboxfile4.png"],
    description: "Secure Excellent Quality Box File to hold documents.",
  },
  {
    name: "Bombay Marble Box File",
    images: ["assets/bmboxfile1.png", "assets/bmboxfile2.png", "assets/bmboxfile3.png"],
    description: "Convenient and Secure Box File for easy access, perfect for less documents.",
  },
  {
    name: "8 Inch Index File",
    images: ["assets/8inchindexfile1.png", "assets/8inchindexfile2.png", "assets/8inchindexfile3.png"],
    description: "High Quality Index File (8 Inches), perfect for office documents.",
  },
  {
    name: "Paper Envelope",
    images: ["assets/envelope1.png", "assets/envelope2.png"],
    description: "High Quality Paper Envelops, perfect for mailing or carrying documents, (Available in multiple sizes).",
  },
];

let filtered = [...products]; // default to all

// Display
const productsContainer = document.getElementById("searchResults");
const searchTitle = document.getElementById("searchTitle");

function displayProducts(list) {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  if (list.length === 0) {
    productsContainer.innerHTML = `<p style="text-align:center;width:100%">No matches found.</p>`;
    return;
  }

  list.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}" />
      <h3>${product.name}</h3>
    `;
    card.addEventListener("click", () => openPopup(index));
    productsContainer.appendChild(card);
  });
}

function openPopup(index) {
  const product = filtered[index];
  const popup = document.getElementById("productPopup");
  const popupImage = popup.querySelector(".popup-img");
  const popupTitle = popup.querySelector("h3");
  const popupDesc = popup.querySelector("p");
  const arrows = popup.querySelectorAll(".popup-arrows button");

  popup.setAttribute("data-current", index);
  popup.setAttribute("data-img-index", "0");

  popupImage.src = product.images[0];
  popupTitle.textContent = product.name;
  popupDesc.textContent = product.description;
  popup.classList.add("active");

  arrows[0].onclick = () => changeImage(-1, product);
  arrows[1].onclick = () => changeImage(1, product);
}

function changeImage(dir, product) {
  const popup = document.getElementById("productPopup");
  let current = parseInt(popup.getAttribute("data-img-index"));
  const total = product.images.length;

  current = (current + dir + total) % total;
  popup.setAttribute("data-img-index", current);
  popup.querySelector(".popup-img").src = product.images[current];
}

document.addEventListener("keydown", (e) => {
  const popup = document.getElementById("productPopup");
  if (!popup || !popup.classList.contains("active")) return;

  const index = parseInt(popup.getAttribute("data-current"));
  const product = filtered[index];
  if (e.key === "ArrowLeft") changeImage(-1, product);
  if (e.key === "ArrowRight") changeImage(1, product);
  if (e.key === "Escape") popup.classList.remove("active");
});

document.getElementById("closePopup")?.addEventListener("click", () => {
  document.getElementById("productPopup")?.classList.remove("active");
});

// Touch swipe
let touchStartX = 0;
document.getElementById("productPopup")?.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
});
document.getElementById("productPopup")?.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - touchStartX;
  if (Math.abs(diff) > 50) {
    const index = parseInt(document.getElementById("productPopup").getAttribute("data-current"));
    const product = filtered[index];
    if (diff > 0) changeImage(-1, product);
    else changeImage(1, product);
  }
});

// Product page logic
if (window.location.pathname.includes("products.html")) {
  const query = localStorage.getItem("searchQuery") || "";
  if (searchInput) searchInput.value = query;

  filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  displayProducts(filtered);

  if (searchTitle) {
    searchTitle.textContent = query ? "Search Results" : "All Products";
  }
}

// Bottom nav only on bottom
const bottomBar = document.querySelector(".bottom-navbar");
if (bottomBar) {
  window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 10) {
      bottomBar.classList.add("visible");
    } else {
      bottomBar.classList.remove("visible");
    }
  });
}

// Scroll to enquiry
const mainEnquiry = document.querySelector(".form-section");
const homeButton = document.getElementById("home-scroll");
if (homeButton && mainEnquiry) {
  homeButton.addEventListener("click", () => {
    mainEnquiry.scrollIntoView({ behavior: "smooth" });
  });
}
