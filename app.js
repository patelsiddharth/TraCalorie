//Storage Controller
const StorageCtrl = (function()
{
    return{
        StoreItem : function(item)
        {
            let items;   
            if(localStorage.getItem('items') === null)
            {
                // Initial with empty array since no item is present in local storage
                items = [];

                // Push New Item
                items.push(item);

                // Update local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
            else
            {
                // Get items in local storage
                items = JSON.parse(localStorage.getItem('items'));
                
                // Push New Item
                items.push(item);

                // Update local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        GetItemsFromStorage : function()
        {
            let items;
            if(localStorage.getItem('items') === null)
            {
                items = [];
            }
            else
            {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        UpdateLocalStorage : function(updatedItem)
        {
            // Get items from local storage
            let items = JSON.parse(localStorage.getItem('items'));

            // Update item from list
            items.forEach((item, index) => {
                if(updatedItem.id == item.id)
                {
                    items.splice(index, 1, updatedItem);
                }
            });

            // Update local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        DeleteItemFromStorage : function(currentItemId)
        {
            // Get items from local storage
            let items = JSON.parse(localStorage.getItem('items'));

            // Update item from list
            items.forEach((item, index) => {
                if(item.id == currentItemId)
                {
                    items.splice(index, 1);
                }
            });

            // Update local storage
            localStorage.setItem('items', JSON.stringify(items));
        },
        ClearAllItemsFromStorage : function()
        {
            localStorage.removeItem('items');
        }
    }
})();

// Item Controller
const ItemCtrl = (function()
{
    // Item Constructor
    const Item = function(id, name, calories)
    {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    
    // Data Structure
    const data = {
        // items : [
        //      { id : 0, name : 'Steak Dinner', calories : 1200 },
        //      { id : 0, name : 'Cookies', calories : 400 },
        //      { id : 0, name : 'Eggs', calories : 459 },
        // ],
        items : StorageCtrl.GetItemsFromStorage(),
        currentItem : null,
        totalCalories : 0
    }

    // Whatever we return will be public. Everything else is private
    return {
        GetItems : function()
        {
            return data.items;
        },
        logData : function()
        {
            return data;
        },
        AddItem : function(input)
        {
            // Calculate Calories
            let ID;
            if(data.items.length > 0)
            {
                ID = data.items[data.items.length - 1].id + 1;
            }
            else
            {
                ID = 0;
            }

            // Convert calories to integer
            const calories = parseInt(input.calories);

            // Create new item
            newItem = new Item(ID, input.name, calories);
            
            // Push new item to data
            data.items.push(newItem);

            return newItem;
        },
        UpdateItem : function (name, calories)
        {
            let found = null;
            data.items.forEach(function(currentitem) 
            {
                if(currentitem.id === data.currentItem.id)
                {
                    currentitem.name = name;
                    currentitem.calories = calories;
                    found = currentitem;
                }    
            });
            return found;
        },
        DeleteItem : function(id) 
        {
            // Get All ids
            const ids = data.items.map(function(item) 
            {
                return item.id;
            })

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index,1);
        },
        ClearAllItems : function() 
        {
            data.items = [];  
        },
        GetTotalCalories : function()
        {
            let total = 0;
            data.items.forEach(function(item){
                total += parseInt(item.calories);
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        GetItemById : function(id)
        {
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id)
                {
                    found = item;
                }
            });
            return found;
        },
        GetCurrentItem : function ()
        {
            return data.currentItem;
        },
        SetCurrentItem : function (item)
        {
            data.currentItem = item;
        }
    }

})();

// UI Controller
const UICtrl = (function()
{
    const UISelector = {
        mealItemList : '#item-list',
        listItems : '#item-list li',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalCalories : '.total-calories',
        btn_Add : '.add-btn',
        btn_Update : '.update-btn',
        btn_Delete : '.delete-btn',
        btn_Back : '.back-btn',
        btn_ClearAll : '.clear-btn'
    };

    return {
        GetSelectors : function()
        {
            return UISelector;
        },
        FocusInput : function()
        {
            document.querySelector(UISelector.itemCaloriesInput).focus();
            document.querySelector(UISelector.itemNameInput).focus();
        },
        GetInput : function()
        {
            const name = document.querySelector(UISelector.itemNameInput)
            const calories = document.querySelector(UISelector.itemCaloriesInput);

            name.classList = name.value === '' ? 'invalid' : '';
            calories.classList = calories.value === '' ? 'invalid' : '';

            if(name.value === '')
            {
                name.focus();
            }
            else if(calories.value === '')
            {
                calories.focus();
            }

            return {
                name : name.value,
                calories : calories.value
            }
        },
        AddListItem : function(newItem)
        {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${newItem.id}`;
            li.innerHTML =
            `
                <strong>${newItem.name} : </strong> <em>${newItem.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            const mealList = document.querySelector(UISelector.mealItemList);
            mealList.insertAdjacentElement('beforeend', li);
        },
        UpdateListItem : function(item)
        {
            let listItems = document.querySelectorAll(UISelector.listItems);

            // Convert Node list to Array 
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) 
            {
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`)
                {
                    document.querySelector(`#${itemId}`).innerHTML = 
                    `
                        <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            });
        },
        DeleteListItem : function(id) 
        {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        PopulateItemList : function(items)
        {
            let html = '';
            items.forEach(function(item){
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name} : </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>`;
            }); 
            document.querySelector(UISelector.mealItemList).innerHTML = html;
        },
        ClearAllListItems : function()
        {
            const mealList = document.querySelector(UISelector.mealItemList);
            mealList.innerHTML = '';
        },
        AddItemToForm : function () 
        {
            const item = ItemCtrl.GetCurrentItem();
            document.querySelector(UISelector.itemNameInput).value = item.name;
            document.querySelector(UISelector.itemCaloriesInput).value = item.calories;  
            UICtrl.EditState(true);
        },
        ShowTotalCalories : function(totalCalories)
        {
            document.querySelector(UISelector.totalCalories).textContent = totalCalories;
        },
        ClearInputs : function()
        {
            document.querySelector(UISelector.itemNameInput).value = '';
            document.querySelector(UISelector.itemCaloriesInput).value = '';
        },
        EditState : function(isEditInProgress)
        {
            if(isEditInProgress)
            {
                document.querySelector(UISelector.btn_Add).style.display = 'none';
                document.querySelector(UISelector.btn_Update).style.display = 'inline';
                document.querySelector(UISelector.btn_Delete).style.display = 'inline';
                document.querySelector(UISelector.btn_Back).style.display = 'inline';
            }
            else
            {
                UICtrl.ClearInputs();
                document.querySelector(UISelector.btn_Add).style.display = 'block';
                document.querySelector(UISelector.btn_Update).style.display = 'none';
                document.querySelector(UISelector.btn_Delete).style.display = 'none';
                document.querySelector(UISelector.btn_Back).style.display = 'none';
            }
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl, StorageCtrl)
{
    // Load Event Listeners
    const LoadEventListeners = function()
    {
        const UISelector = UICtrl.GetSelectors();

        // Disable Enter
        document.addEventListener('keypress', function(e)
        {
            if(e.keyCode === 13 || e.which === 13)
            {
                e.preventDefault();
                return false;
            }   
        })

        // Add Item event
        document.querySelector(UISelector.btn_Add).addEventListener('click', ItemAddSubmit);

        // Edit button event
        document.querySelector(UISelector.mealItemList).addEventListener('click', ItemEditSubmit);

        // Update button event
        document.querySelector(UISelector.btn_Update).addEventListener('click',ItemUpdateSubmit);

        // Delete button event
        document.querySelector(UISelector.btn_Delete).addEventListener('click',ItemDeleteSubmit);

        // Back button event
        document.querySelector(UISelector.btn_Back).addEventListener('click',BackSubmit);

        // Clear All button event
        document.querySelector(UISelector.btn_ClearAll).addEventListener('click',ClearAllSubmit);
    }

    const ItemAddSubmit = function(e)
    {
        const input = UICtrl.GetInput();
        if(input.name !== '' && input.calories !== '')
        {
            // Add new item to data structure
            const newItem = ItemCtrl.AddItem(input);

            // Update UI to display new item
            UICtrl.AddListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.GetTotalCalories();
            //Show total calories
            UICtrl.ShowTotalCalories(totalCalories);

            // Store in local Storage
            StorageCtrl.StoreItem(newItem);

            // Clear Input fields
            UICtrl.ClearInputs();
        }
        e.preventDefault();
    }

    const ItemEditSubmit = function(e)
    {
        if(e.target.classList.contains('edit-item'))
        {
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.GetItemById(id);

            // Set CurrentItem
            ItemCtrl.SetCurrentItem(itemToEdit);

            // Add item to UI Form
            UICtrl.AddItemToForm();

            // Set Focus
            UICtrl.FocusInput();
        }
        e.preventDefault();
    }

    const ItemUpdateSubmit = function(e) 
    {
        const input = UICtrl.GetInput();

        if(input.name !== '' && input.calories !== '')
        {
            // Update Item in Data Structure
            const upatedItem = ItemCtrl.UpdateItem(input.name, input.calories);

            // Update Item in UI
            UICtrl.UpdateListItem(upatedItem);

            // Update Item storage
            StorageCtrl.UpdateLocalStorage(upatedItem);

            // Get total calories
            const totalCalories = ItemCtrl.GetTotalCalories();
            //Show total calories
            UICtrl.ShowTotalCalories(totalCalories);

            // Change Edit state
            UICtrl.EditState(false);
        }

        e.preventDefault();    
    }

    const ItemDeleteSubmit = function(e)
    {
        // Get Current Item
        const currentItem = ItemCtrl.GetCurrentItem();
        
        // Delete item data structure 
        ItemCtrl.DeleteItem(currentItem.id);

        // Delete from UI
        UICtrl.DeleteListItem(currentItem.id);

        // Delete from Local Storage
        StorageCtrl.DeleteItemFromStorage(currentItem.id);

         // Get total calories
         const totalCalories = ItemCtrl.GetTotalCalories();
         //Show total calories
         UICtrl.ShowTotalCalories(totalCalories);
 
         // Change Edit state
         UICtrl.EditState(false);

        e.preventDefault();    
    }

    const BackSubmit = function(e)
    {
        // Change Edit state
        UICtrl.EditState(false);
        e.preventDefault();
    }

    const ClearAllSubmit = function(e)
    {
        // Remove all items from data structure
        ItemCtrl.ClearAllItems();

        // Remove all items from UI
        UICtrl.ClearAllListItems();

        // Remove all items from local storage
        StorageCtrl.ClearAllItemsFromStorage();

        // Get total calories
        const totalCalories = ItemCtrl.GetTotalCalories();
        //Show total calories
        UICtrl.ShowTotalCalories(totalCalories);

        // Change Edit state
        UICtrl.EditState(false);

        e.preventDefault();
    }

    console.log(ItemCtrl.logData())
    return{
        init : function()
        {
            console.log('Initializing App...');

            // Initialize edit state
            UICtrl.EditState(false);

            // Fetch items
            const items = ItemCtrl.GetItems();
            console.log(items);
            UICtrl.PopulateItemList(items);

            // Get total calories
            const totalCalories = ItemCtrl.GetTotalCalories();
            //Show total calories
            UICtrl.ShowTotalCalories(totalCalories);

            //Load Event Listeners
            LoadEventListeners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

//Initial App
App.init();