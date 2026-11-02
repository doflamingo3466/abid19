
// Default productss
let productss = JSON.parse(localStorage.getItem("productss")) || [
    {id: 1, name: "Watch", price: 3500, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6ietlXBerSvPZepfhzXVWKyuz7ZJTEFsVJ6Eb6qedNQ&s=10"},
    {id: 2, name: "Headphones", price: 4500, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvIlNTMsopEZOienQdJaEOa0T0CwV0GtUCosPVjcx85g&s=10"},
    {id: 3, name: "Backpack", price: 2800, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLoVmb5SGXtiZfHLabaHTkeIHJDK8qSX4r5LSsmSDSdA&s=10"}
];

localStorage.setItem("productss", JSON.stringify(productss));

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display productss
function showproductss() {

    productss = JSON.parse(localStorage.getItem("productss")) || [];

    let output = "";

    productss.forEach(p => {
        output += `
        <div class="card">
            <img src="${p.image}" alt="${p.name}">
            <h3>${p.name}</h3>
            <h4>Rs. ${p.price}</h4>
            <button onclick="addCart(${p.id})">Add to Cart</button>
        </div>`;
    });

    document.getElementById("productss").innerHTML = output;
}

// Add to Cart
function addCart(id) {

    let item = cart.find(p => p.id === id);

    if (item) {
        item.qty++;
    } else {
        let p = productss.find(p => p.id === id);
        cart.push({...p, qty: 1});
    }

    saveCart();
}

// Display Cart
function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

    let output = "";
    let total = 0;
    let count = 0;

    cart.forEach(p => {
        output += `
        <div class="cart-item">
            ${p.name} x ${p.qty} = Rs. ${p.price * p.qty}
            <div>
                <button onclick="changeQty(${p.id},-1)">-</button>
                <button onclick="changeQty(${p.id},1)">+</button>
                <button onclick="removeCart(${p.id})">Remove</button>
            </div>
        </div>`;

        total += p.price * p.qty;
        count += p.qty;
    });

    document.getElementById("cart-items").innerHTML = output || "Cart is empty.";
    document.getElementById("total").innerText = total;
    document.getElementById("count").innerText = count;
}

// Change Quantity
function changeQty(id, amount) {

    let item = cart.find(p => p.id === id);

    item.qty += amount;

    if (item.qty <= 0) {
        removeCart(id);
    } else {
        saveCart();
    }
}

// Remove Item
function removeCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
}

// Place Order
document.getElementById("order-form").onsubmit = function(e) {

    e.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    let total = 0;
    cart.forEach(p => total += p.price * p.qty);

    let order = {
        id: Date.now(),
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        payment: document.getElementById("payment").value,
        items: cart,
        total: total,
        status: "Pending"
    };

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    saveCart();

    this.reset();

    document.getElementById("message").innerText =
        "Order placed successfully! Order ID: " + order.id;
};

showproductss();
saveCart();
