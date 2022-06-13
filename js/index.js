class Cl_cookies {
   set(cname, cValue = '', exDays = 7) {
      let d = new Date()
      d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000))
      let expires = `expires=${d.toUTCString()}`
      document.cookie = `${cname}=${cValue};${expires};path=/`
   }

   /**
    * @param cname
    * @returns {string}
    * source: https://www.w3schools.com/js/js_cookies.asp
    */
   get(cname) {
      let name = `${cname}=`,
         decodedCookie = decodeURIComponent(document.cookie),
         ca = decodedCookie.split(';')
      for (let i = 0; i < ca.length; i++) {
         let c = ca[i].trim()
         if (c.indexOf(name) === 0)
            return c.substring(name.length, c.length)
      }
      return ""
   }

   isSet(cname) {
      let name = `${cname}=`,
         decodedCookie = decodeURIComponent(document.cookie),
         ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
         let c = ca[i].trim()
         if (c.indexOf(name) === 0)
            return true
      }
      return false
   }
}


class Cl_dbProducts extends Cl_cookies {
   constructor() {
      super()
      this.cookieName = 'demoAppProducts'
   }

   getList() {
      let products
      try {
         products = JSON.parse(this.get(this.cookieName))
      } catch (e) {
         products = []
      }
      return products
   }

   setList(list) {
      super.set(this.cookieName, JSON.stringify(list))
   }

   set(id, name, price,img) {
      let products = this.getList(),
         product = {name: name, price: price,img:img}
      for (let i in products)
         if (i === id)
            products[i] = product
      if (products.length === 0)
         products.push(product)
      this.setList(products)
   }
   ///revisarrr
   add(name,price,img) {
      let products = this.getList()
      products.push({name: name, price: price,img:img})
      this.setList(products)
   }

   del(id) {
      let products = this.getList()
      products.splice(id, 1)
      this.setList(products)
   }
}



class Cl_ProductsModal {
   Cl_divProducts = class {
      Cl_divProduct = class {
         constructor({app, owner, id, product}) {
            this.app = app
            this.id = id
            this.inName = document.querySelectorAll('.card h5')
            this.inName.textContent = product.name
            this.inPrice = document.querySelectorAll('.card p')
            this.inPrice.textContent = product.price
            this.inImame = document.querySelectorAll('.card img')
            this.inImame.src = product.img
            this.btDelete = owner.getElementsByClassName('product_btDelete')[0]
            this.btnDetalle = owner.getElementsByClassName('btnDetll')[0]
            let oi = this
            this.inName.oninput = this.inPrice.oninput = function () {
               oi.saveContact()
            }
            this.btDelete.onclick = function () {
               if (confirm('¿Seguro de eliminar el elemento?')) {
                  oi.app.dbContacts.del(oi.id)
                  oi.app.productsModal.refresh()
               }
            }
            this.btnDetalle.onclick = function (e) {
               let nombre = e.target.parentElement.parentElement.children[0]
               let precio = e.target.parentElement.parentElement.children[1]
               let img = e.target.parentElement.parentElement.children[2].children[0]

               let tituloDetalle = document.querySelectorAll('.text h2')[0]
               let precioDetalle = document.querySelectorAll('.text p')[0]
               let imgDetalle =  document.querySelectorAll('.dtl img')[0]

               tituloDetalle.textContent = nombre.textContent
               precioDetalle.innerHTML = precio.textContent
               imgDetalle.src = img.src
               console.log(tituloDetalle.textContent)
               console.log(precioDetalle.innerHTML)
               oi.app.productsModal.refresh()
               
              
            }
         }

         saveContact() {
            this.app.dbContacts.set(this.id, this.inName.textContent, this.inPrice.textContent,this.inImame.src)
         }
      }

      constructor({app, owner}) {
         this.app = app
         this.owner = owner
         this.divProducts = document.getElementById('products_divContacts')
         this.divProductsTemplate = this.divProducts.children[0].cloneNode(true)

         this.clear()
         this.products = null
      }

      clear() {
         this.divProducts.innerHTML = ''
      }

      chargeItems() {
         this.clear()
         let itemPosition = 0,
            products = this.app.dbContacts.getList()
            var counterProducts = document.getElementById('count_product')
            counterProducts.innerHTML = products.length
         for (let id in products) {
            
            let newDivProduct = this.divProductsTemplate.cloneNode(true)
            console.log(newDivProduct)
            newDivProduct.children[0].textContent = products[id].name
            newDivProduct.children[1].textContent = products[id].price
            newDivProduct.children[2].children[0].src = products[id].img

            this.divProducts.appendChild(newDivProduct)
            new this.Cl_divProduct({
               app: this.app,
               owner: newDivProduct,
               id: id,
               product: products[id],
            })
         }
      }
   }

   constructor({app}) {
      this.app = app
      this.divProducts = new this.Cl_divProducts({
         app: app,
         owner: this,
      })
      this.btAdd = document.querySelectorAll('.card a')
      let oi = this
      for (let i = 0; i < this.btAdd.length; i++) {
         
            this.btAdd[i].onclick = function (e) {
            let nombreProduct = e.target.parentElement.parentElement.parentElement.children[1].children[0].children[0]
            console.log(nombreProduct)
            let precioPrucuct = e.target.parentElement.parentElement.parentElement.children[1].children[0].children[1]
            let imgProduct = e.target.parentElement.parentElement.parentElement.children[0]
            oi.app.dbContacts.add(nombreProduct.textContent,precioPrucuct.textContent,imgProduct.src)
            oi.refresh()
         }
      }
     
   }

   onload() {
      this.refresh()
   }

   refresh() {
      this.divProducts.chargeItems()
   }

  
}

class Cl_demoApp {
   constructor() {
         
      this.dbContacts = new Cl_dbProducts({app: this})
      
      this.productsModal = new Cl_ProductsModal({app: this})
      let oi = this
      document.onreadystatechange = () => {
         if (document.readyState === 'complete') {
            oi.productsModal.onload()
         }
      }
   }
}

let demoApp = new Cl_demoApp()