const tasks = document.querySelector('.tasks');
var inputValue = document.querySelector('.todoinput');
const add = document.querySelector('.createtodo');

if(window.localStorage.getItem("todos") == null){
    var todos = [];
    var ind = 0;
    window.localStorage.setItem("todos", JSON.stringify(todos));
    window.localStorage.setItem("IND", JSON.stringify(ind));
}

var todosEX = window.localStorage.getItem("todos");
var todos = JSON.parse(todosEX);
var ind = 0

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
	
        check = this.checkButton(input, check);
        remove = this.removeIcon(remove);

        tasks.appendChild(task);
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(remove);
        task.appendChild(editbtn);
        document.getElementById('scroll').scrollTop = task.offsetHeight + task.offsetTop;
    }

    checkButton(input, check){
        check.addEventListener('mouseover', function(e){
            if (!e.currentTarget.classList.contains("fa-check-circle")){
                e.currentTarget.classList.remove("fa-circle", "unchecked")
                e.currentTarget.classList.add("fa-dot-circle")
            }
        }, false); 
    
            check.addEventListener("mouseout", function(e){
                    if (!e.currentTarget.classList.contains("fa-check-circle")){
                e.currentTarget.classList.remove("fa-dot-circle")
                e.currentTarget.classList.add("fa-circle", "unchecked")
            }
            }, false);
            
            check.classList.add("far", "fa-circle", "unchecked");
            check.addEventListener('click', function(e) {
                var defaultstyle=input.style;
                if (e.currentTarget.classList.contains("fa-dot-circle")){
                    e.currentTarget.classList.remove("fa-dot-circle")
                    e.currentTarget.classList.add("fa-check-circle")
                    input.style.cssText= "text-decoration:line-through ; color:gray; opacity: 60%";
                }
                else{
                    e.currentTarget.classList.remove("fa-check-circle")
                    e.currentTarget.classList.add("fa-circle", "unchecked"	)
                    input.style.removeProperty("text-decoration", "line-through");      
                    input.style= defaultstyle;         
                }
            }, false);

        return check;
    }

    removeIcon(remove){
        remove.classList.add("fal", "fa-trash-alt", "delete-task");
        remove.addEventListener('click', function (e) {
            e.currentTarget.parentNode.remove();
            let index = todos.indexOf(name);
            todos.splice(index, 1);
            ind -= 1;
            window.localStorage.setItem("todos", JSON.stringify(todos));
            window.localStorage.setItem("IND", JSON.stringify(ind));
        }, false);

        return remove;
    }

}

function check() {
    if (inputValue.value != "") {
        new item(inputValue.value);
        todos.push(inputValue.value);
        window.localStorage.setItem("todos", JSON.stringify(todos));
        ind += 1;
        window.localStorage.setItem("IND", JSON.stringify(ind));
        inputValue.value = "";
    }
}

function main (){
    
    add.addEventListener('click', check);
    window.addEventListener('keydown', (e) => {
        if (e.which == 13) {
            check();
        }
    })
    
    for (var v = 0 ; v < todos.length ; v++){
    new item(todos[v]);
}
}

main()
