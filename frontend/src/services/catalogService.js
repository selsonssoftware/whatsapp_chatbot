const PKEY='demo_products'; const CKEY='demo_categories'
const products=[{id:1,name:'T-Shirt',sku:'TS001',description:'Cotton tee',category:'Apparel',price:19.99,currency:'USD',stock:10,image:'',status:'active',updatedAt:'2026-01-01'}]
const categories=['Apparel','Electronics']
export function getProducts(){const r=localStorage.getItem(PKEY);if(!r){localStorage.setItem(PKEY,JSON.stringify(products));return products}return JSON.parse(r)}
export function saveProducts(l){localStorage.setItem(PKEY,JSON.stringify(l))}
export function getCategories(){const r=localStorage.getItem(CKEY);if(!r){localStorage.setItem(CKEY,JSON.stringify(categories));return categories}return JSON.parse(r)}
export function saveCategories(l){localStorage.setItem(CKEY,JSON.stringify(l))}
