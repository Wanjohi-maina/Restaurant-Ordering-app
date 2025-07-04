import { menuArray } from '/data.js'
const paymentModalForm = document.getElementById("payment-modal-form")
let orders = []

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

function handleAddItem (itemId) {
    // Check if the item is already in the orders array
   const alreadyAdded = orders.some( item =>  item.id === Number(itemId)) 
  // Check if the item has NOT already been added in the orders array
   if (!alreadyAdded) {
   const selectedItem = menuArray.find( item =>  item.id === Number(itemId))
   if(selectedItem){
       orders.push(selectedItem)
   }
   render()
}
}

function getOrderCart () {
    if (orders.length === 0){
        return ''
    }
    const orderHtml = orders.map( order => {
     return `
        <div class="order-items">
            <div class="order-details">
                <h3>${order.name}</h3>
                <button class="order-remove" data-remove="${order.id}">remove</button>
            </div>
            <p class="bold">$${order.price}</p>
        </div>
     `
    }).join('')
    const totalPrice = orders.reduce((total, currentItem) => total + currentItem.price, 0)
    return `
        <div class="order-cart">
            <h2 class="order-title">Your Order</h2>
            <div>${orderHtml}</div>
            <div class="order-price">
                <h2 class="order-subtitle">Total Price:</h2>
                <p class="bold">$${totalPrice}</p>
            </div>
            <button id="complete-order-btn">Complete order</button>
        </div>
    `
}

function handleRemoveItem(itemId) {
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].id === Number(itemId)) {
            orders.splice(i, 1) // Remove the item at index i
            break // Stop after removing one item
        }
    }
    render()
}

function handleCompeleteOrder() {
   document.getElementById("payment-modal").style.display = "block"
}


paymentModalForm.addEventListener('submit', e => {
     e.preventDefault()
     orderFormData ()
     closePaymentModal () 
})

function orderFormData (){
    const paymentFormData = new FormData(paymentModalForm)
    const name = paymentFormData.get('fullName')
    
    orders = []
    render ()

    const thanksMessage = `<p class="note">Thanks, ${name}! Your order is on its way!</p>`
    document.getElementById('order-section').innerHTML += thanksMessage
}

function closePaymentModal () {
    document.getElementById("payment-modal").style.display = "none"
    paymentModalForm.reset()
}

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

function render () {
    document.getElementById('menu-section').innerHTML = getMenuHtml()
    document.getElementById('order-section').innerHTML = getOrderCart()
}
render ()