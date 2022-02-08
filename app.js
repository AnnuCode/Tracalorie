const StorageCtrl = (function(){
    return {
        storeItem: function(item){
            let items
            if (localStorage.getItem("items") === null){
                items=[]
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }
            else{
                items = JSON.parse(localStorage.getItem("items"))
                items.push(item)
                localStorage.setItem("items", JSON.stringify(items))
            }
        },
        getItemsFromLocalStorage: function(){
            let items
            if(localStorage.getItem("items")===null){
                items = []
            }else{
                items = JSON.parse(localStorage.getItem("items"))
            }
            return items
        },
        updateItemSubmitt: function(updatedItem){
            let items = JSON.parse(localStorage.getItem("items"))
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem)
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem("items"))
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1)
                }
            })
            localStorage.setItem("items", JSON.stringify(items))
        },
        clearItemsFromLocalStorage(){
            localStorage.removeItem("items")
        }

    }
})()
const itemCtrl = (function(){
function Items (id,name,calories){
    this.id = id
    this.name = name
    this.calories = calories

}
const data = {
    // items: [
    //     // {id:0, name:"Egg", calories: 300},
    //     // {id:1, name:"Brownies", calories: 600},
    //     // {id:2, name:"Fruits", calories: 400}
    // ],
    items: StorageCtrl.getItemsFromLocalStorage(),
    currentItem: null,
    totalCalories: 0
}
return {
    getItems: function(){
    return data.items
},
addItem: function(name, calories){
let ID
if(data.items.length > 0){
ID=data.items[data.items.length - 1].id + 1
}
else {
    ID = 0
}
calories = parseInt(calories)
const newItem = new Items(ID,name, calories)
data.items.push(newItem)
return newItem
},

// totalCalories: function(){
//     let total = 0
// data.items.forEach(function(item){
// total += item.calories

// })
// return total
// },
getTotalCalories: function(){
let total = 0
data.items.forEach(function(item){
    total += item.calories
})
data.totalCalories = total // What would happen if I return 'total' without assigning it to data.totalCalories?
return data.totalCalories
},
getItemById: function(ID){
let found = null
    data.items.forEach(function(item){
if(item.id === ID){
    found = item
}
})
return found
},

setCurrentItem: function(item){
data.currentItem = item
},
getCurrentItem: function(){
return data.currentItem
},
updateItem: function(name, calories){
    calories = parseInt(calories)
    let found = null
data.items.forEach(function(search){
if (search.id === data.currentItem.id){
    search.name = name
    search.calories = calories
    found = search
}

})
return found
},
deleteItem: function(id){
const ids = data.items.map(function(item){
return item.id
})
const index = ids.indexOf(id)
data.items.splice(index, 1)
},
clearAllItems: function(){
    data.items = []
},
    logData: function(){
    console.log(data)
}
}

})()


const UICtrl = (function(){
const UIselectors ={
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalcalories: ".total-calories",
    clearAllButton: ".clear-btn",
    updateButton: ".update-btn",
    deleteButton: ".delete-btn",
    backButton: ".back-btn"
}

return {
    populateItemList: function (items){
        document.querySelector(UIselectors.itemList).style.display = "block"
    let html=""
    items.forEach(function(items){
        html += ` <li class="collection-item" id="item-${items.id}">
        <strong>${items.name}: </strong> <em>${items.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`
    })
    document.querySelector(UIselectors.itemList).innerHTML = html
    },
    getSelectors: function(){
        return UIselectors
    },
    getItemInput: function(){
     return {
        name: document.querySelector(UIselectors.itemName).value,
        calories: document.querySelector(UIselectors.itemCalories).value
     }
    },
    addListItem: function (list){
    document.querySelector(UIselectors.itemList).style.display = "block"
    const li = document.createElement("li")
    li.className = "collection-item"
    li.id = `item-${list.id}`
    li.innerHTML = `
    <strong>${list.name}: </strong> <em>${list.calories} Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i>
    </a>`
    document.querySelector(UIselectors.itemList).insertAdjacentElement("beforeend", li)
    
    },
    hideList: function(){
    document.querySelector(UIselectors.itemList).style.display = "none"
    },
    showTotalCalories: function(totalcal){
      document.querySelector(UIselectors.totalcalories).textContent = totalcal
    },
    clearEditState: function(){
        UICtrl.clearInput ()
    document.querySelector(UIselectors.updateButton).style.display = "none"
    document.querySelector(UIselectors.deleteButton).style.display = "none"
    document.querySelector(UIselectors.backButton).style.display = "none"
    document.querySelector(UIselectors.addBtn).style.display = "inline"

    },
    addItemToForm: function(){
        document.querySelector(UIselectors.itemName).value = itemCtrl.getCurrentItem().name
        document.querySelector(UIselectors.itemCalories).value = itemCtrl.getCurrentItem().calories
    },
    showEditState: function(){
        document.querySelector(UIselectors.updateButton).style.display = "inline"
        document.querySelector(UIselectors.deleteButton).style.display = "inline"
        document.querySelector(UIselectors.backButton).style.display = "inline"
        document.querySelector(UIselectors.addBtn).style.display = "none"
    },
    updateListItem: function(item){
        const listItems = document.querySelectorAll(UIselectors.listItems)
        const listArray = Array.from(listItems)
        
        listArray.forEach(function(search){
        
            const itemId = search.getAttribute("id")
        if (itemId === `item-${item.id}`){
            document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`
        }    
        })
       
            
    },
    deleteListItem: function(id){
        const itemId = `#item-${id}`
        const item = document.querySelector(itemId)
        item.remove()
    },
    removeItems: function(){
        let listItems = document.querySelectorAll(UIselectors.listItems)
        listItems = Array.from(listItems)
        listItems.forEach(function(item){
            item.remove()
        })
    },
    clearInput: function(){
    document.querySelector(UIselectors.itemName).value = ""
    document.querySelector(UIselectors.itemCalories).value = ""
    }
}

})()


const app = (function(itemCtrl, StorageCtrl, UICtrl){

    const loadEventListeners = function(){
       const UIselectors = UICtrl.getSelectors()
        document.querySelector(UIselectors.addBtn).addEventListener("click", itemAddSubmit)
        document.querySelector(UIselectors.itemList).addEventListener("click", itemAdd)
        document.querySelector(UIselectors.updateButton).addEventListener("click", itemUpdateSubmit)
        document.querySelector(UIselectors.backButton).addEventListener("click", UICtrl.clearEditState())
        document.querySelector(UIselectors.deleteButton).addEventListener("click", deleteItemSubmit)
        document.querySelector(UIselectors.clearAllButton).addEventListener("click", clearAllItemsClick)
        document.addEventListener("keypress", function(e){
            if (e.key === "Enter"){
                e.preventDefault()
                return false

            }
        })
    }

        const itemAddSubmit = function(e){
        const input = UICtrl.getItemInput()
        if (input.name !== "" && input.calories !== ""){
            const newItem = itemCtrl.addItem(input.name, input.calories)
            UICtrl.addListItem(newItem)
            // UICtrl.populateItemList(itemCtrl.getItems()) // alternate way
            // console.log(itemCtrl.totalCalories())
            const totalCalories = itemCtrl.getTotalCalories() //getting total calories
            UICtrl.showTotalCalories(totalCalories)
            StorageCtrl.storeItem(newItem)
            UICtrl.clearInput()
        }
       
        
        e.preventDefault()
        }
        const itemAdd = function(e){
        if(e.target.classList.contains("edit-item")){
        const listId = e.target.parentNode.parentNode.id
        const listIdArr = listId.split("-")
        const Id = parseInt(listIdArr[1])
        const itemToEdit = itemCtrl.getItemById(Id)
        itemCtrl.setCurrentItem(itemToEdit)
        UICtrl.addItemToForm()
        UICtrl.showEditState()
        
        }
            e.preventDefault()
        }

        const itemUpdateSubmit = function(e){
        const input = UICtrl.getItemInput()
        const updatedItem = itemCtrl.updateItem(input.name, input.calories)
        UICtrl.updateListItem(updatedItem)
        const totalCalories = itemCtrl.getTotalCalories() //getting total calories
        UICtrl.showTotalCalories(totalCalories)
        StorageCtrl.updateItemSubmitt(updatedItem)
        UICtrl.clearEditState()
        console.log(updatedItem.name)
            
        e.preventDefault()

        }

        const deleteItemSubmit = function(e){
            const currentItem = itemCtrl.getCurrentItem()
            itemCtrl.deleteItem(currentItem.id)
            const totalCalories = itemCtrl.getTotalCalories() //getting total calories
            UICtrl.showTotalCalories(totalCalories)
            UICtrl.deleteListItem(currentItem.id)
            StorageCtrl.deleteItemFromStorage(currentItem.id)
            UICtrl.clearEditState()
            e.preventDefault()
        }

        const clearAllItemsClick = function(e){
            itemCtrl.clearAllItems()
            UICtrl.removeItems()
            const totalCalories = itemCtrl.getTotalCalories() //getting total calories
            UICtrl.showTotalCalories(totalCalories)
            StorageCtrl.clearItemsFromLocalStorage()
            UICtrl.hideList()
            e.preventDefault()
        }

return {
    init: function(){
        UICtrl.clearEditState()
     const items = itemCtrl.getItems()  
     if(items.length === 0){
      UICtrl.hideList()
     } else{
        UICtrl.populateItemList(items)
     }
     const totalCalories = itemCtrl.getTotalCalories() //getting total calories
     UICtrl.showTotalCalories(totalCalories)
     
     loadEventListeners()
    }
}
})(itemCtrl, StorageCtrl, UICtrl)
app.init()
