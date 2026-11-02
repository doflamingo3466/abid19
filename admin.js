
// Admin Credentials
let admin = {
    name: "abid",
    email: "abid@gmail.com",
    password: "3466"
};

// Login
document.getElementById("login-form").onsubmit = function(e) {

    e.preventDefault();

    if (
        document.getElementById("username").value === admin.name &&
        document.getElementById("email").value === admin.email &&
        document.getElementById("password").value === admin.password
    ) {
        localStorage.setItem("login", "true");
        openDashboard();
    } else {
        document.getElementById("error").innerText = "Invalid credentials!";
    }
};

// Open Dashboard
function openDashboard() {
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    showData();
}

// Check Login
if (localStorage.getItem("login") === "true") {
    openDashboard();
}

// Logout
function logout() {
    localStorage.removeItem("login");
    location.reload();
}

// Display productss and Orders
function showData() {

    let productss = JSON.parse(localStorage.getItem("productss")) || [];
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    document.getElementById("product-count").innerText = productss.length;
    document.getElementById("order-count").innerText = orders.length;

    let output = "";

    productss.forEach(p => {
        output += `
        <div class="admin-product">
            ${p.name} - Rs. ${p.price}
            <div>
                <button onclick="editProduct(${p.id})">Edit</button>
                <button onclick="deleteProduct(${p.id})">Delete</button>
            </div>
        </div>`;
    });

    document.getElementById("product-list").innerHTML = output || "No productss.";

    // Show Orders
    output = "";

    orders.forEach(o => {
        output += `
        <div class="order">
            <h3>Order #${o.id}</h3>
            <p>Customer: ${o.name}</p>
            <p>Phone: ${o.phone}</p>
            <p>Address: ${o.address}</p>
            <p>Payment: ${o.payment}</p>
            <p>Total: Rs. ${o.total}</p>
            <p>productss: ${o.items.map(p => p.name + " x " + p.qty).join(", ")}</p>

            Status:
            <select onchange="updateStatus(${o.id}, this.value)">
                <option ${o.status === "Pending" ? "selected" : ""}>Pending</option>
                <option ${o.status === "Processing" ? "selected" : ""}>Processing</option>
                <option ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
                <option ${o.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
        </div>`;
    });

    document.getElementById("order-list").innerHTML = output || "No orders yet.";
}

// Add / Edit Product
document.getElementById("product-form").onsubmit = function(e) {

    e.preventDefault();

    let productss = JSON.parse(localStorage.getItem("productss")) || [];
    let id = document.getElementById("edit-id").value;

    let product = {
        id: id ? Number(id) : Date.now(),
        name: document.getElementById("pname").value,
        price: Number(document.getElementById("price").value),
        image: document.getElementById("image").value
    };

    if (id) {
        productss = productss.map(p => p.id === Number(id) ? product : p);
    } else {
        productss.push(product);
    }

    localStorage.setItem("productss", JSON.stringify(productss));

    this.reset();
    cancelEdit();
    showData();
};

// Edit Product
function editProduct(id) {

    let productss = JSON.parse(localStorage.getItem("productss")) || [];
    let p = productss.find(p => p.id === id);

    document.getElementById("edit-id").value = p.id;
    document.getElementById("pname").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("image").value = p.image;

    document.getElementById("heading").innerText = "Edit Product";
}

// Cancel Edit
function cancelEdit() {
    document.getElementById("product-form").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("heading").innerText = "Add Product";
}

// Delete Product
function deleteProduct(id) {

    if (confirm("Delete this product?")) {

        let productss = JSON.parse(localStorage.getItem("productss")) || [];

        productss = productss.filter(p => p.id !== id);

        localStorage.setItem("productss", JSON.stringify(productss));

        showData();
    }
}

// Update Order Status
function updateStatus(id, status) {

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let order = orders.find(o => o.id === id);
    order.status = status;

    localStorage.setItem("orders", JSON.stringify(orders));
}
