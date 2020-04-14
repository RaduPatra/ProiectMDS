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
        check.addEventListener('click', function(e) {
            var defaultstyle=input.style;
			if (e.currentTarget.classList.contains("unchecked")){
				e.currentTarget.classList.remove("fa-circle", "unchecked")
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
        remove.classList.add("fal", "fa-trash-alt", "delete-task");
        remove.addEventListener('click', function (e) {
            e.currentTarget.parentNode.remove();
        }, false);

  
        tasks.appendChild(task);
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(remove);
        task.appendChild(editbtn);
        document.getElementById('scroll').scrollTop = task.offsetHeight + task.offsetTop;
    }
    remove()
    {
        
    }

}

function check() {
    if (inputValue.value != "") {
        new item(inputValue.value);
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

    new item("Go shopping");
    new item("Drink coffee");
}

main()
