const tasks = document.querySelector('.tasks');
var inputValue = document.querySelector('.todoinput');
const add = document.querySelector('.createtodo');
var count = window.localStorage.getItem("ind")
var todos = window.localStorage.getItem("todos")
var cnt = 1;
function searchObj(nume) {
    for (i = 0; i < todos.length; i++) {
        //console.log(todos[i])
        if (todos[i].name == nume || todos[i].name === nume) {
            return i;
        }
    }
    return -1;
}

function findLastStar() {
    for (i = 0; i < todos.length; i++) {
        //console.log(todos[i])
        if (todos[i].star_flag == 1) {
            return i;
        }
    }
    return -1;
}

function addTimeEvent(date){

        date.addEventListener('click', function (e) {
            if (date.classList.contains("fal")) {
                //daca e inactiv
                date.classList.remove("fal")
                date.classList.add("fas")

                document.getElementById("inputMinute").style.display = "inline"

            }

            else if (date.classList.contains("fas")) {
                //daca e activ

                document.getElementById("countdown").style.display = "none"

                date.classList.remove("fas")
                date.classList.add("far", "fa-alarm-exclamation")
            }

            else if (date.classList.contains("far")) {
                //expirat
                date.classList.remove("far", "fa-alarm-exclamation")
                date.classList.add("fal", "fa-alarm-clock")
            }
        }, 0)

        return date
}

function getInputObject(){
    var inputMinute = document.createElement("INPUT");
    inputMinute.setAttribute("type", "number");
    inputMinute.placeholder = "Introduceti nr minute"
    inputMinute.id = "inputMinute"  
    inputMinute.value = ""
    inputMinute.style.display = "none"


    inputMinute.addEventListener('keydown', (e) => {
    if (e.which == 13) {
        if (e.currentTarget.value != "") {
            var cnt = document.getElementById("countdown")
            cnt.style.display = "inline"
            e.currentTarget.style.display = "none"

            var val = e.currentTarget.value
            var d = new Date()

            var x = setInterval(function(){
                var now = new Date()
                var valoare = ((val * 60) - parseInt((now - d) / 1000))//numar secunde
          
                let mins = parseInt(valoare / 60)
                let secs = parseInt(valoare % 60)
                let string = mins + ":" + secs
               
                cnt.innerHTML = "<p>" + string + "</p>"

            if (valoare < 0 || cnt.style.display == "none"){
                clearInterval(x) 

                if (valoare < 0)
                    alert("Countdown over!")
                cnt.style.display = "none"                }
            }, 1000)
                    
        }
    }
    })
    
    return inputMinute
}

class item {
    constructor(name, f1 = 0, f2 = 0, f3 = 0) {
        this.createItem(name, f1, f2, f3);
        this.name = name;
        this.check_flag = f1;
        this.star_flag = f2;
        this.alarm_flag = f3;
    }

    getName() { return this.nume };

    createItem(name, f1, f2, f3) {
        var task = document.createElement('div');
        var check = document.createElement('i');
        var input = document.createElement('p');
        var remove = document.createElement('i');
        var editbtn = document.createElement('button');
        var star = document.createElement("i");
        var date = document.createElement("i");

        //todo
        editbtn.classList.add("edit-task", "fa", "fa-edit");

        task.classList.add('task');
        input.textContent = name;
        input.classList.add('text');
        input.contentEditable = "false";

        check = this.checkIcon(check, input, this, f1);
        remove = this.removeIcon(remove, name);
        editbtn = this.editTask(editbtn, name, input);
        star = this.starIcon(star, this, f2);

        tasks.insertBefore(task, tasks.firstChild);
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(star);
        task.appendChild(remove);
        task.appendChild(editbtn);
        task.appendChild(date);

	var divSecund = this.creareDivInput(f3);
        task.appendChild(divSecund);
    }

creareDivInput(flag) {
        var div = document.createElement("div")
        var date = document.createElement("i")
        date.classList.add("alarma")

        //de loat timpi din local storage
        if (flag == 0) {
            //initial "fal fa-alarm-clock"
            date.classList.add("fal", "fa-alarm-clock")

        }
        else if (flag == 1) {
            //daca alarma e pending fas fa-alarm-clock
            date.classList.add("fas", "fa-alarm-clock")

        }
        else if (flag == 2) {
            //daca suna alarma far fa-alarm-exclamation
            date.classList.add("far", "fa-alarm-exclamation")
        }

        div.appendChild(addTimeEvent(date))
        div.appendChild(getInputObject())

        var x = document.createElement('p')
        x.style.display = "none"
        x.id = "countdown"
        div.appendChild(x)

        return div
    }

    checkIcon(check, input, obj, flag) {
        if (flag >= 1) {
            check.classList.add("far", "fa-check-circle")
            input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
        }
        else {
            check.classList.add("far", "fa-circle", "unchecked");
        }
        check.addEventListener('mouseover', function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-circle", "unchecked")
                e.currentTarget.classList.add("fa-dot-circle")
            }
        }, false);

        check.addEventListener("mouseout", function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle")
                e.currentTarget.classList.add("fa-circle", "unchecked")
            }
        }, false);

        check.addEventListener('click', function (e) {
            //da check
            var defaultstyle = input.style;
            if (e.currentTarget.classList.contains("fa-dot-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle")
                e.currentTarget.classList.add("fa-check-circle")
                input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
                obj.check_flag = 1;
            }
            else {
                //nu da check
                e.currentTarget.classList.remove("fa-check-circle")
                e.currentTarget.classList.add("fa-circle", "unchecked")
                input.style.removeProperty("text-decoration", "line-through");
                input.style = defaultstyle;
                obj.check_flag = 0;
            }
            //local storage    
            let ind = searchObj(obj.name)
            todos[ind] = obj
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }, false);

        return check;
    }


    editTask(editbtn, name, input) {

        var ind;
        editbtn.addEventListener("click", function (e) {

            editbtn.addEventListener("keypress", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });

            if (input.contentEditable == "false") {
                console.log(" click edit ");
                ind = searchObj(name);
                console.log(" name " + name + " ind " + ind + " tc " + input.textContent);
                input.contentEditable = "true";
                input.focus();
                editbtn.classList.remove("edit-task", "fa", "fa-edit");
                editbtn.classList.add("save-edit", "fal", "fa-clipboard-check");
                input.addEventListener("keypress", function (event) {
                    if (event.keyCode == 13) {
                        input.contentEditable = "false"
                        editbtn.classList.add("edit-task", "fa", "fa-edit");
                        editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");

                        todos[ind].name = input.textContent;
                        console.log(" todo ind " + todos[ind]);
                        window.localStorage.setItem("todos", JSON.stringify(todos));
                    }
                });
            }
            else {
                input.contentEditable = "false";
                editbtn.classList.add("edit-task", "fa", "fa-edit");
                editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");
                console.log(" click save ");
                console.log(" name2 " + name + " ind2 " + ind + " tc2 " + input.textContent);

                todos[ind].name = input.textContent;
                console.log(" todo ind " + todos[ind]);
                window.localStorage.setItem("todos", JSON.stringify(todos));

            }
        })

        return editbtn;
    }

    removeIcon(remove, name) {
        remove.classList.add("fal", "fa-trash-alt", "delete-task");
        remove.addEventListener("click", function (e) {
            e.currentTarget.parentNode.remove();
            let ind = searchObj(name);
            todos.splice(ind, 1);

            count--;
            window.localStorage.setItem("todos", JSON.stringify(todos));
            window.localStorage.setItem("ind", JSON.stringify(count));
        }, false);

        return remove;
    }

    starIcon(star, obj, flag) {
        if (flag == 1) {
            star.classList.add("fas", "fa-star")
        }
        else {
            star.classList.add("far", "fa-star");
        }
        star.addEventListener("click", function (e) {
            //daca bifeaza steluta
            if (e.currentTarget.classList.contains("far")) {
                e.currentTarget.classList.remove("far")
                e.currentTarget.classList.add("fas")

                //modifica local storage
                let ind = searchObj(obj.name)
                obj.star_flag = 1;
                todos[ind] = obj;

                tasks.insertBefore(star.parentNode, tasks.firstChild);
                todos.sort(function (a, b) { return a.star_flag - b.star_flag }); //sort dupa stelute
                window.localStorage.setItem("todos", JSON.stringify(todos));
            }
            else {
                //daca se debiefaza steluta
                e.currentTarget.classList.remove("fas")
                e.currentTarget.classList.add("far")

                //modifica local storage
                let ind = searchObj(obj.name)
                obj.star_flag = 0;
                todos[ind] = obj;
                todos.sort(function (a, b) { return a.star_flag - b.star_flag }); //sort dupa stelute
                window.localStorage.setItem("todos", JSON.stringify(todos));


                //mut taskul dupa ultima stea
                var starind = findLastStar();
                var elements = tasks.children;
                tasks.insertBefore(star.parentNode, elements.item(elements.length-starind+1));
            }
        })
        return star;
    }
}

function check() {
    if (inputValue.value != "") {
        var x = new item(inputValue.value);

        inputValue.value = "";
        if (searchObj(x.name) != -1) {
            alert("Exista deja acest To-Do!")
            let task = document.querySelector('.task');
            task.parentNode.removeChild(task)
            return -1
        }

        todos.push(x);
        window.localStorage.setItem("todos", JSON.stringify(todos));

        count++;
        window.localStorage.setItem("ind", count);

        console.log("Exista " + count + " task-uri.")
    }
}


function localStoragefun() {
    //window.localStorage.clear()

    if (count == null) {
        count = 0;
        window.localStorage.setItem("ind", count)
    }

    if (todos == null) {
        todos = [];
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }
    else{
    todos = JSON.parse(todos);
    }
}

function deleteAllTasks(){
	window.localStorage.clear()
	var tasks1 = document.getElementsByClassName("task")

	console.log(tasks1.length)
	if (tasks1.length > 0){
		for (var i = 0; i < tasks1.length; i++)
			tasks1[i].parentNode.removeChild(tasks1[i])
		for (i of tasks1)
			i.parentNode.removeChild(i)
	}
									
}

function addDeleteAllTasksButton(){
	var x = document.getElementsByClassName("todo-header")
	
	var button = document.createElement('i')
	button.classList.add("far", "fa-eraser")
	button.alt = "delete-tasks"

	button.addEventListener("mouseover", function(e){
	 	e.currentTarget.classList.remove("far")
	 	e.currentTarget.classList.add("fas")
	}, 1)

	button.addEventListener("mouseout", function(e){
	 	e.currentTarget.classList.remove("fas")
	 	e.currentTarget.classList.add("far")
	}, 1)

	button.addEventListener("click", function (e){
		for (i of [1, 2])//ma jur ca nu stiu cum da nu merge fara asta
			deleteAllTasks()
	}, 1)

	x[0].appendChild(button)
}

function main() {
    localStoragefun()
    addDeleteAllTasksButton()

    add.addEventListener('click', check);
    window.addEventListener('keydown', (e) => {
        if (e.which == 13) {
            check();
        }
    })

    for (let i = 0; i < todos.length; i++) {
        new item(todos[i].name, todos[i].check_flag, todos[i].star_flag, 0);
    }

    console.log("Exista " + count + " task-uri.")
}

main()
