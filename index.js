import { menuArray } from '/data.js'

const paymentModalForm = document.getElementById("payment-modal-form")
let orders = []

// Event delegation for add, remove, and complete order
document.addEventListener('click', e => {
   if(e.target.dataset.add){
      handleAddItem(e.target.dataset.add)
   }
   else if (e.target.dataset.remove){
      handleRemoveItem(e.target.dataset.remove)
   }
   else if (e.target.id === 'complete-order-btn') {
      handleCompeleteOrder()
   }
})

// Add item with quantity tracking
function handleAddItem (itemId) {
   const existingItem = orders.find( item =>  item.id === Number(itemId)) 
   if (existingItem) {
   existingItem.quantity++
   }
   else {
    const selectedItem = menuArray.find( item => item.id === Number(itemId))
    if (selectedItem) {
        orders.push({...selectedItem, quantity: 1})
    }
   }
  render ()
}


// Build the cart HTML with quantity, subtotal, discount
function getOrderCart () {
    if (orders.length === 0){
        return ''
    }
    const orderHtml = orders.map( order => {
       const itemTotal = order.price * order.quantity
     return `
        <div class="order-items">
            <div class="order-details">
                <h3>${order.name}</h3>
                <button class="order-remove" data-remove="${order.id}">remove</button>
            </div>
            <p class="bold">$${itemTotal.toFixed(2)}</p>
        </div>
     `
    }).join('')
   
   // Calculate the total price before discount
    const totalPrice = orders.reduce((total, item) => total + (item.price * item.quantity), 0)
   
   // Apply discount rules
    let discountRate = 0
    if (totalPrice > 100) {
       discountRate = 0.15 // 15%
     }
    else if (totalPrice > 50 ){
      discountRate = 0.10 // 10%
    }
    const discountAmount = totalPrice * discountRate
    const finalTotal = totalprice - discountAmount
   
   // Build discount HTML using if/else
    let discountHtml = ''
    if (discountRate > 0 ){
        discountHtml = `
        <div class="order-discount">
            <h2 class="order-subtitle">Discount (${discountRate * 100}%):</h2>
            <p class="green-text">- $${discountAmount.toFixed(2)}</p>
        </div>   
        `
    }
   
   // Return the full HTML string
    return `
        <div class="order-cart">
            <h2 class="order-title">Your Order</h2>
            ${orderHtml}
            <div class="order-price">
                <h2 class="order-subtitle">Subtotal:</h2>
                <p class="bold">$${totalPrice.toFixed(2)}</p>
            </div>
            ${discountHtml}
            <div class="order-price">
                <h2 class="order-subtitle">Total Price:</h2>
                <p class="bold">$${finalTotal.toFixed(2)}</p>
            </div>
            <button id="complete-order-btn">Complete order</button>
        </div>
    `
}

// Remove item or decrease quantity
function handleRemoveItem(itemId) {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === Number(itemId)) {
           if(orders[i].quantity > 1) {
              orders[i].quantity--  // Reduce the quantity
           }
           else {
              orders.splice(i, 1) // Remove the item completely
           }
           break // Stop the loop after finding the item
        }
    }
    render()
}

// Show payment modal on complete order
function handleCompeleteOrder() {
   document.getElementById("payment-modal").style.display = "block"
}

// Handle payment form submit
paymentModalForm.addEventListener('submit', e => {
     e.preventDefault()
     orderFormData ()
     closePaymentModal () 
})

// Build thank-you message and reset
function orderFormData (){
    const paymentFormData = new FormData(paymentModalForm)
    const name = paymentFormData.get('fullName')
    
    orders = []
    render ()

    const thanksMessage = `<p class="note">Thanks, ${name}! Your order is on its way!</p>`
    document.getElementById('order-section').innerHTML += thanksMessage
}

// Hide modal and reset form
function closePaymentModal () {
    document.getElementById("payment-modal").style.display = "none"
    paymentModalForm.reset()
}

// Render menu items
function getMenuHtml() {
    return menuArray.map( menuItem => {
        const { name, ingredients, id, price, emoji } = menuItem
        return `
        <div class="menu-item">
            <div class="menu-emoji">${emoji}</div>
            <div class="menu-info">
                <h2>${name}</h2>
                <p class="menu-ingredients">${ingredients.join(', ')}</p>
                <h3 class="menu-price">$${price}</h3>
            </div>
            <div class="menu-action">
                <button data-add="${id}"> + </button>
            </div>
        </div>
        `
    }).join('')
}

// Render entire UI
function render () {
    document.getElementById('menu-section').innerHTML = getMenuHtml()
    document.getElementById('order-section').innerHTML = getOrderCart()
}
render ()
