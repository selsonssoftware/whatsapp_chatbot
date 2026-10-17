const OKEY='demo_orders'; const TKEY='demo_transactions'
const orders=[{id:1,customer:'John Doe',items:[{productId:1,name:'T-Shirt',sku:'TS001',qty:1,price:19.99}],subtotal:19.99,discount:0,tax:0,shipping:0,total:19.99,currency:'USD',paymentStatus:'paid',status:'pending',createdAt:'2026-01-01',updatedAt:'2026-01-01'}]
const tx=[{id:1,orderId:1,customer:'John Doe',amount:19.99,currency:'USD',method:'Card',status:'success',createdAt:'2026-01-01',updatedAt:'2026-01-01'}]
export function getOrders(){const r=localStorage.getItem(OKEY);if(!r){localStorage.setItem(OKEY,JSON.stringify(orders));return orders}return JSON.parse(r)}
export function saveOrders(l){localStorage.setItem(OKEY,JSON.stringify(l))}
export function getTransactions(){const r=localStorage.getItem(TKEY);if(!r){localStorage.setItem(TKEY,JSON.stringify(tx));return tx}return JSON.parse(r)}
export function saveTransactions(l){localStorage.setItem(TKEY,JSON.stringify(l))}
