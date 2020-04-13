const tasks = document.querySelector('.tasks');
var inputValue = document.querySelector('.todoinput');
const add = document.querySelector('.createtodo');

class item {
    constructor(name) {
        this.createItem(name);
    }
    createItem(name) {
        var task = document.createElement('div');
        var check = document.createElement('i');
        var input = document.createElement('p');
        var remove = document.createElement('i');
        var editbtn = document.createElement('button');


        editbtn.classList.add("edit-task", "fa", "fa-edit");

        task.classList.add('task');
        input.textContent = name;

        input.classList.add('text');
        check.classList.add("far", "fa-circle", "unchecked");
        remove.classList.add("fal", "fa-trash-alt", "delete-task");


        remove.addEventListener('click', function (e) {
            e.currentTarget.parentNode.remove();
        }, false);


        tasks.appendChild(task);
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(remove);
        task.appendChild(editbtn);
    }
    remove()
    {
        
    }

}

add.addEventListener('click', check);
window.addEventListener('keydown', (e) => {
    if (e.which == 13) {
        check();
    }
})

function check() {
    if (inputValue.value != "") {
        new item(inputValue.value);
        inputValue.value = "";
    }
}

new item("Go shopping");
new item("Drink coffee");
