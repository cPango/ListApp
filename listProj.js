window.addEventListener("DOMContentLoaded", function startPageEvent() {

    //These variables are declared to make reading/writing code a cleaner process.
    const listItems = document.getElementsByTagName('li');
    const $form = $('#newItemForm');
    const inputBox = document.querySelector('input.newValue'); //Input box

    //Array for each item added to list.
    let entries = [];

    //Constructor for each entry object.
    function Entry(name, ticked) {
        this.name = name;
        this.ticked = false;
    }

    //Turn entry into an object and pushes it into the array 'entries'.
    addEntry = (name) => {
        let item = new Entry(name);
        entries.push(item);
        saveEntry(entries);
    }

    //Removes entry from it's position on the list.
    removeEntry = (index) => {
        entries.splice(index, 1);
        saveEntry(entries);
    }

    //Saves current state of list.
    saveEntry = (entryArr) => {
        let str = JSON.stringify(entryArr);
        localStorage.setItem('entries', str);
    }

    //Returns the objects from the 'entries' array at the particular index.
    getEntry = (index) => entries[index];

    //Parses the data in localStorage and puts it back into the 'entries' array.
    loadEntries = () => {
        let str = localStorage.getItem('entries');
        entries = JSON.parse(str);
        if (!entries){
            entries = [];
        }
    }

    //Returns the list to the web page after it's parsed from the function 'loadEntries'.
    listEntries = () => {
        for (var i in entries){
            const li = document.createElement('li');
            const span = document.createElement('span');
            span.textContent = entries[i].name;
            li.appendChild(span);
            $('ul').append(li);
            attachButtons(li);

            if (entries[i].ticked == true){
                document.querySelectorAll('.tickBox')[i].checked = true;
                li.className = 'ticked';

                li.querySelector('.edit').style.display = 'none';
                    li.querySelector('.up').style.display = 'none';
                    li.querySelector('.down').style.display = 'none';
            }
        }
    }

    //load title from localstorage
    titleLoad = () => {
        let str = localStorage.getItem('title')
        if (str){
            $('#title').text(str);
        } else {
            $('#title').text("New list");
        }
    };

    //Reads the order of the list items >> places into array >> replaces entries array
    saveListOrder = () => {
        let entriesReplace = [];

        for(let x = 0; x < listItems.length; x++) {
            let item = new Entry(listItems[x].textContent);
            entriesReplace.push(item); 
            for(let i = 0; i < listItems.length; i++){
                if(entries[i].name == entriesReplace[x].name && entries[i].ticked == true){
                    entriesReplace[x].ticked = true;
                }
            };            
        };
        entries = entriesReplace;
        saveEntry(entries);
    };

    loadEntries();
    listEntries();
    titleLoad();
    saveListOrder();

    //Creates & appends buttons to each list item.
    function attachButtons(li){
        function createListFunction(elementName, elementClass, elementSrc){
            const element = document.createElement(elementName);
            element.className = elementClass;
            element.id = 'funcBtn';
            element.type = 'image';
            element.src = elementSrc;
            li.appendChild(element);
        }

        const tickBox = document.createElement('input')
        tickBox.type = 'checkbox';
        tickBox.className = 'tickBox';
        li.appendChild(tickBox);
        tickBox.value = tickBox.parentNode.textContent;

        createListFunction('input', 'remove', 'images/RemoveBtn.png');

        li.innerHTML = li.innerHTML + "<br />";

        createListFunction('input', 'up', 'images/UpArrow.png');
        createListFunction('input', 'down', 'images/DownArrow.png');
        
        createListFunction('input', 'edit', 'images/editBtn.png' );
        createListFunction('input', 'save', 'images/saveBtn.png');


    }

    //All new entries will use this to capitalize the first letter
    upperFirst = (string) => string.charAt(0).toUpperCase() + string.slice(1);

    //Adds functionality to buttons.
    $('ul').on('click change', (x) => {
        const li = x.target.parentNode;
        const ul = li.parentNode;
        const span = li.firstElementChild;
        let prevContent = span.id;

        if(x.target.tagName == 'INPUT'){
            
            if(x.target.className == 'up'){
                let prevLi = li.previousElementSibling;
                if(prevLi){
                    ul.insertBefore(li, prevLi);
                    saveListOrder();
                }
            }
            if(x.target.className == 'down'){
                let nextLi = li.nextElementSibling;
                if(nextLi){
                    ul.insertBefore(li, nextLi.nextElementSibling);
                    saveListOrder();
                }
            }
            if(x.target.className == 'remove'){
                ul.removeChild(li);
                for(let i = 0; i < entries.length; i++){
                    if (span.textContent == entries[i].name){
                        removeEntry(i)
                    }
                }
            }
            if(x.target.className == 'edit'){
                li.querySelector('.edit').style.display = 'none';
                li.querySelector('.save').style.display = 'inline-block';
                li.querySelector('.tickBox').style.display = 'none';
                li.id = 'editting';

                for(let i = 0; i < entries.length; i++){
                    if (entries[i].name == span.textContent){
                        entries[i].ticked = false;
                        li.querySelector('.tickBox').checked = false;
                        li.className = '';
                    }
                }

                const inputEdit = document.createElement('input');
                inputEdit.type = 'text';
                inputEdit.value = span.textContent;
                li.insertBefore(inputEdit, span);
                li.removeChild(span);
                localStorage.removeItem(prevContent);
            }
            if (x.target.className == 'save'){
                li.querySelector('.edit').style.display = 'inline-block';
                li.querySelector('.save').style.display = 'none';
                li.querySelector('.tickBox').style.display = 'inline-block';

                const input = li.firstElementChild;
                const span = document.createElement('span');
                let upper = upperFirst(input.value);
                span.textContent = upper;

                for(let i = 0; i < entries.length; i++){
                    if (listItems[i].id == 'editting'){
                        entries[i].name = upper;
                        li.id = '';
                    }
                }

                li.insertBefore(span, input);
                li.removeChild(input);
                li.querySelector('.tickBox').value = upper;
                saveEntry(entries);
                if (!showEditButtons) {
                    minimalModeCheck();
                }
            }
        }

        //Checks entries are ticked and swaps the class for appropriate CSS change.
        if (x.target.className == 'tickBox'){
            for (i = 0; i < entries.length; i++){
                if (entries[i].name == x.target.value && x.target.checked){
                    li.className = 'ticked';
                    entries[i].ticked = true;
    
                    li.querySelector('.edit').style.display = 'none';
                    li.querySelector('.up').style.display = 'none';
                    li.querySelector('.down').style.display = 'none';
    
                    saveEntry(entries);
                }
                else if (entries[i].name == x.target.value && !x.target.checked) {
                    li.className = ' ';
                    entries[i].ticked = false;
                    
                    if(showEditButtons){
                        li.querySelector('.edit').style.display = 'inline-block';
                        li.querySelector('.up').style.display = 'inline-block';
                        li.querySelector('.down').style.display = 'inline-block';
                    }

                    saveEntry(entries);
                }
            }
        };
    });

    //turns minimal mode on & off
    let showEditButtons = true;

    function minimalModeCheck(){
      if(showEditButtons){
            for(i = 0; i < listItems.length; i++){
                if(listItems[i].className != "ticked"){
                    listItems[i].querySelector('.up').style.display = "inline-block";
                    listItems[i].querySelector('.down').style.display = "inline-block";
                    listItems[i].querySelector('.edit').style.display = "inline-block";
                }
            }
            document.querySelector('header').querySelector('#newTitleEdit').style.display = "inline-block";
        }
        else {
            for(i = 0; i < listItems.length; i++){
                listItems[i].querySelector('.up').style.display = "none";
                listItems[i].querySelector('.down').style.display = "none";
                listItems[i].querySelector('.edit').style.display = "none";
            }
            document.querySelector('header').querySelector('#newTitleEdit').style.display = "none";
        }
    }

    $('#toggleBtnOff').on('click', () => {
        $('#toggleBtnOff').hide();
        $('#toggleBtnOn').show();
        showEditButtons = false;
        minimalModeCheck();
    });

    $('#toggleBtnOn').on('click', () => {
        $('#toggleBtnOff').show();
        $('#toggleBtnOn').hide();
        showEditButtons = true;
        minimalModeCheck();
    });

    //Reads input box and places the value into the heading.
    $('#newTitleEdit').on('click', () => {
        const header = document.querySelector('header');
        const h1 = document.querySelector('h1');
        const span = document.querySelector('#title');

        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.id = 'titleEdit';
        inputEdit.value = h1.textContent;
        $('#newTitleEdit').hide();
        $('#newTitleSave').show();

        header.insertBefore(inputEdit, h1);
        header.removeChild(h1);

        localStorage.removeItem('title');
    });

    $('#newTitleSave').on('click', () => {
        const header = document.querySelector('header');
        const titleEditTxt = document.querySelector('#titleEdit');
        const inputEdit = document.querySelector('#titleEdit')

        $('#newTitleSave').hide();
        $('#newTitleEdit').show();

        const h1 = document.createElement('h1');
        const span = document.createElement('span');
        span.id = "title";
        span.textContent = inputEdit.value;
        h1.appendChild(span);

        header.insertBefore(h1, inputEdit);
        header.removeChild(inputEdit);

        localStorage.setItem('title', inputEdit.value);
    });

    //Takes the content from the Input box and places into the list if not empty, then clearing the input box.
    $form.on('submit', (e) => {
        let submitEntry = true;
        e.preventDefault();
        const li = document.createElement('li');
        const span = document.createElement('span');
        li.appendChild(span);

        let listItemValue = upperFirst(inputBox.value);
        span.textContent = listItemValue.trim();

        //checks item is not already on list
        for(i=0;i<listItems.length;i++){
            if(li.textContent == listItems[i].textContent){
                submitEntry = false;
            }
        }

        //stop entry insertion if box is not between 1 to 20 characters or is already on the list.
        //the extra 5 are for the buttons
        if (li.textContent != '' && li.textContent.length <= 25 && submitEntry == true){
            addEntry(listItemValue);
            saveEntry(entries);
            $('ul').append(li);
            attachButtons(li);
            minimalModeCheck();
        } else {
            alert("Entry must be between 1 to 20 characters long and not already be on the list");
        }

        inputBox.value = '';
    });

    //Checks each item in the list begins if their beginning letter is higher than it's neighbours.
    //The switches are used to trigger the ordering 'insertBefore' function to correctly place each list item if the above case is true.
    $('button.orderList').on('click', (x) => {
        let switching = true, shouldSwitch, i;

        while(switching){
            switching = false;
            for(i=0;i<(listItems.length - 1);i++){
                shouldSwitch = false;
                if (listItems[i].textContent > listItems[i+1].textContent){
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch){
                listItems[i].parentNode.insertBefore(listItems[i + 1], listItems[i]);
                switching = true;
            }
        }
        saveListOrder();        
    });
});
