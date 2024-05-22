
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");


//open
cartIcon.onclick = () => {
    cart.classList.add("active");
};

//close
closeCart.onclick = () => {
    cart.classList.remove("active");
};

//add cart thing
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready);
}
else{
    ready();
}

function ready(){
    //remove item
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for(var i = 0; i<removeCartButtons.length; i++){
        var button =removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    //quantity
    var quantityInputs = document.getElementsByClassName("cart-quantity"); 
    for(var i = 0; i<quantityInputs.length; i++){
        var input =quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    //add cart
    var addCart = document.getElementsByClassName("add-cart"); 
    for(var i = 0; i<addCart.length; i++){
        var button =addCart[i];
        button.addEventListener("click", addCartClicked);
    }
    loadCartItems();
}

function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
}

function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

//add cart function
function addCartClicked(event){
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
    var price = shopProducts.getElementsByClassName("price")[0].innerText;
    var productImg = shopProducts.getElementsByClassName("product-img")[0].src
    addProductToCart(title,price,productImg);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title,price,productImg){
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++){
        if(cartItemsNames[i].innerText == title){
            alert("You have already added this item to the bee cart");
            return;
        }
    }
    var cartBoxContent = `<img src="${productImg}" alt="" class="cart-img">
    <div class="detail-box">
        <div class="cart-product-title"> ${title}</div>
        <div class="cart-price"><i class='bx bxs-droplet' ></i> ${price}</div>
        <input type="number" name="hmask" id="sumth" value="1" class="cart-quantity">
    </div>
    <!--remove item-->
    <i class='bx bxs-trash-alt cart-remove'></i>`
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox.getElementsByClassName("cart-remove")[0]
    .addEventListener('click', removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
    saveCartItems();
    updateCartIcon();
}

//ud total
function updatetotal(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    
    for(var i=0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("honey ", ''));
        var quantity = quantityElement.value;
        total+= price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("total-price")[0].innerText = "honey " + total;

    localStorage.setItem('cartTotal',total);
}

function saveCartItems(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var cartItems = [];

    for(var i=0; i<cartBoxes.lentgth; i++){
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
        var priceElement = cart.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;

        var item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartItems(){
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems){
        cartItems = JSON.parse(cartItems);

        for(var i=0; i<cartItems.length; i++){
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);

            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
    var cartTotal =localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText = "honey" + cartTotal;
    }
    updateCartIcon();
}

//cart item quantity
function updateCartIcon(){
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for(var i=0; i < cartBoxes.length; i++){
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        quantity += parseInt(quantityElement.value);
    }
    var cartIcon = document.querySelector('#cart-icon');
    cartIcon.setAttribute('data-quantity', quantity);
}

document.querySelector(".btn-buy").addEventListener("click", function() {
    // customer information
    let custName = document.getElementById("cust_name").value;
    let custEmail = document.getElementById("cust_email").value;
    let custAddr = document.getElementById("cust_addr").value;

    // cart items
    let cartItems = [];
    let cartBoxes = document.getElementsByClassName("cart-box");
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let prodName = cartBox.getElementsByClassName("cart-product-title")[0].innerText;
        let prodPrice = cartBox.getElementsByClassName("cart-price")[0].innerText.replace("honey ", '');
        let quantity = cartBox.getElementsByClassName("cart-quantity")[0].value;

        for (let j = 0; j < quantity; j++) {
            cartItems.push({ prod_name: prodName, prod_price: parseFloat(prodPrice) });
        }
    }

    let custOrder = JSON.stringify(cartItems);

    //sirjmcheckout
    let form = document.createElement("form");
    form.method = "GET";
    form.action = "http://sirjm.infinityfreeapp.com/checkout.php";

    let inputName = document.createElement("input");
    inputName.type = "hidden";
    inputName.name = "cust_name";
    inputName.value = custName;
    form.appendChild(inputName);

    let inputEmail = document.createElement("input");
    inputEmail.type = "hidden";
    inputEmail.name = "cust_email";
    inputEmail.value = custEmail;
    form.appendChild(inputEmail);

    let inputAddr = document.createElement("input");
    inputAddr.type = "hidden";
    inputAddr.name = "cust_addr";
    inputAddr.value = custAddr;
    form.appendChild(inputAddr);

    let inputOrder = document.createElement("input");
    inputOrder.type = "hidden";
    inputOrder.name = "cust_order";
    inputOrder.value = custOrder;
    form.appendChild(inputOrder);

    document.body.appendChild(form);
    form.submit();
});

