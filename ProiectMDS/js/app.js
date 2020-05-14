const tasks = document.querySelector('.tasks');
var inputValue = document.querySelector('.todoinput');
const addTodoBtn = document.querySelector('.createtodo');
const sortByFav = document.querySelector('.sortByFav');
const sortByDate = document.querySelector('.sortByDate');
const deleteAllBtn = document.querySelector('.deleteAll');

var displaymethod = window.localStorage.getItem("displaymethod");
var todos = window.localStorage.getItem("todos");


function searchObj(nume) {
    for (i = 0; i < todos.length; i++) {
        //console.log(todos[i])
        if (todos[i].name == nume || todos[i].name === nume) {
            return i;
        }
    }
    return -1;
}

//tasks trb sa fie sortate descr dupa nr de stele
function findLastStar() {
    for (i = 0; i < todos.length; i++) {
        if (todos[i].star_flag == 0) {
            return i;
        }
    }
    return todos.length;
}


function addTimeEvent(date) {

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

function getInputObject() {
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

                var x = setInterval(function () {
                    var now = new Date()
                    var valoare = ((val * 60) - parseInt((now - d) / 1000))//numar secunde

                    let mins = parseInt(valoare / 60)
                    let secs = parseInt(valoare % 60)
                    let string = mins + ":" + secs

                    cnt.innerHTML = "<p>" + string + "</p>"

                    if (valoare < 0 || cnt.style.display == "none") {
                        clearInterval(x)

                        if (valoare < 0)
                            alert("Countdown over!")
                        cnt.style.display = "none"
                    }
                }, 1000)

            }
        }
    })

    return inputMinute
}

sortByFav.addEventListener('click', e => {
    //sory by stars, update storage
    todos.sort(function (a, b) { return b.star_flag - a.star_flag; });
    window.localStorage.setItem("todos", JSON.stringify(todos));

    //update display method
    displaymethod = 1;
    displayMethodAux = displaymethod;
    window.localStorage.setItem("displaymethod", displaymethod);

    //remove current tasks
    tasks.innerHTML = '';

    //add sorted tasks
    displaymethod = 0;
    for (let i = 0; i < todos.length; i++) {
        new item(todos[i].name, todos[i].check_flag, todos[i].star_flag, 0, todos[i].creation_date);
    }
    displaymethod = displayMethodAux;
})

sortByDate.addEventListener('click', e => {
    //sory by time, update storage
    todos.sort(function (a, b) { return b.creation_date - a.creation_date; });
    window.localStorage.setItem("todos", JSON.stringify(todos));

    //update display method
    displaymethod = 2;
    displayMethodAux = displaymethod;
    window.localStorage.setItem("displaymethod", displaymethod);

    //remove current tasks
    tasks.innerHTML = '';

    //add sorted tasks
    displaymethod = 0;
    for (let i = 0; i < todos.length; i++) {
        new item(todos[i].name, todos[i].check_flag, todos[i].star_flag, 0, todos[i].creation_date);
    }
    displaymethod = displayMethodAux;
})

class item {
    constructor(name, f1 = 0, f2 = 0, f3 = 0, f4 = 0) {
        this.name = name;
        this.check_flag = f1;
        this.star_flag = f2;
        this.alarm_flag = f3;
        this.creation_date = f4;
        console.log(displaymethod)
        console.log("testing")
        console.log(todos)

        if (displaymethod != 0) {
            var date = new Date();
            var timestamp = date.getTime();
            this.creation_date = timestamp;
        }

        this.createItem(name, f1, f2, f3);
        console.log(timestamp)
    }

    createItem(name, f1, f2, f3) {
        var task = document.createElement('div');
        var check = document.createElement('i');
        var input = document.createElement('p');
        var remove = document.createElement('i');
        var editbtn = document.createElement('button');
        var star = document.createElement("i");
        var date = document.createElement("i");


        editbtn.classList.add("edit-task", "fa", "fa-edit");
        task.classList.add('task');
        input.textContent = name;
        input.classList.add('text');
        input.contentEditable = "false";

        //event listeners
        check = this.checkIcon(check, input, this, f1);
        remove = this.removeIcon(remove, name);
        editbtn = this.editTask(editbtn, name, input);
        star = this.starIcon(star, this, f2);

        //load from storage insert mode
        if (displaymethod == 0)
            tasks.appendChild(task);

        //sort by stars insert mode
        if (displaymethod == 1) {
            var lastStarInd = findLastStar();
            tasks.insertBefore(task, tasks.children.item(lastStarInd))
        }

        //sort by date mdoe
        if (displaymethod == 2) {
            tasks.insertBefore(task, tasks.firstChild);
        }

        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(star);
        task.appendChild(remove);
        task.appendChild(editbtn);

        var divSecund = this.creareDivInput(f3);
        task.appendChild(divSecund);

    }

    creareDivInput(flag) {
        var div = document.createElement("div")

        var date = document.createElement("i")
        date.classList.add("alarma")

        //de bagat local storage
        if (flag == 0) {
            //initial "fal fa-alarm-clock"
            date.classList.add("fal", "fa-alarm-clock");

        }
        else if (flag == 1) {
            //daca alarma e pending fas fa-alarm-clock
            date.classList.add("fas", "fa-alarm-clock");

        }
        else if (flag == 2) {
            //daca suna alarma far fa-alarm-exclamation
            date.classList.add("far", "fa-alarm-exclamation");
        }

        div.appendChild(addTimeEvent(date))
        div.appendChild(getInputObject())

        var x = document.createElement('p')
        x.id = "countdown"
        div.appendChild(x)

        return div
    }


    checkIcon(check, input, obj, flag) {
        if (flag == 1) {
            check.classList.add("far", "fa-check-circle");
            input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
        }
        else {
            check.classList.add("far", "fa-circle", "unchecked");
        }
        check.addEventListener('mouseover', function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-circle", "unchecked");
                e.currentTarget.classList.add("fa-dot-circle");
            }
        }, false);

        check.addEventListener("mouseout", function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle");
                e.currentTarget.classList.add("fa-circle", "unchecked");
            }
        }, false);

        check.addEventListener('click', function (e) {
            //da check
            var defaultstyle = input.style;
            if (e.currentTarget.classList.contains("fa-dot-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle");
                e.currentTarget.classList.add("fa-check-circle");
                input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
                obj.check_flag = 1;
            }
            else {
                //nu da check
                e.currentTarget.classList.remove("fa-check-circle");
                e.currentTarget.classList.add("fa-circle", "unchecked");
                input.style.removeProperty("text-decoration", "line-through");
                input.style = defaultstyle;
                obj.check_flag = 0;
            }
            //local storage    
            var ind = searchObj(obj.name);
            todos[ind] = obj;
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }, false);

        return check;
    }


    editTask(editbtn, name, input) {

        editbtn.addEventListener("click", function (e) {

            /*editbtn.addEventListener("keypress", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });*/
            var ind = searchObj(name);

            if (input.contentEditable == "false") {
                input.contentEditable = "true";
                input.focus();
                editbtn.classList.remove("edit-task", "fa", "fa-edit");
                editbtn.classList.add("save-edit", "fal", "fa-clipboard-check");

                //save on enter
                input.addEventListener("keypress", function (event) {
                    if (event.keyCode == 13) {
                        input.contentEditable = "false"
                        editbtn.classList.add("edit-task", "fa", "fa-edit");
                        editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");

                        todos[ind].name = input.textContent;
                        window.localStorage.setItem("todos", JSON.stringify(todos));
                    }
                });
            }
            else {
                input.contentEditable = "false";
                editbtn.classList.add("edit-task", "fa", "fa-edit");
                editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");

                todos[ind].name = input.textContent;
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

            window.localStorage.setItem("todos", JSON.stringify(todos));
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


                //daca sortez dupa stele
                if (displaymethod == 1) {
                    //insert la inceput in local storage
                    todos.splice(0, 0, todos[ind])
                    todos.splice(ind + 1, 1)
                    tasks.insertBefore(star.parentNode, tasks.firstChild);//mut taskul la inceput cand bifez
                }
                window.localStorage.setItem("todos", JSON.stringify(todos));
            }
            else {
                if (displaymethod == 1)
                    var lastStarInd = findLastStar();

                //daca se debiefaza steluta
                e.currentTarget.classList.remove("fas")
                e.currentTarget.classList.add("far")

                //modifica local storage
                let ind = searchObj(obj.name);
                obj.star_flag = 0;
                todos[ind] = obj;

                //daca sortez dupa stele
                if (displaymethod == 1) {
                    //insert dupa ultima steluta in local storage
                    todos.splice(lastStarInd, 0, todos[ind])
                    todos.splice(ind, 1)
                    tasks.insertBefore(star.parentNode, tasks.children.item(lastStarInd));//mut taskul dupa ultima stea cand debifez
                }
                window.localStorage.setItem("todos", JSON.stringify(todos));
            }
        })
        return star;
    }
}

function addTodo() {

    if (inputValue.value != "") {

        if (searchObj(inputValue.value) != -1) {
            alert("Exista deja acest To-Do!");
            return;
        }

        var x = new item(inputValue.value);
        inputValue.value = "";

        //load from local storage
        if (displaymethod == 0)
            todos.push(x);

        // add after last star in local storage
        if (displaymethod == 1) {
            var lastStarInd = findLastStar();
            todos.splice(lastStarInd, 0, x)
        }

        //at at the begining in local storage
        if (displaymethod == 2) {
            todos.unshift(x);
        }

        window.localStorage.setItem("todos", JSON.stringify(todos));
        console.log("Exista " + todos.length + " task-uri.");
    }
}


function loadLocalStorage() {
    //localStorage.clear()

    if (displaymethod == null) {
        displaymethod = 2;
        window.localStorage.setItem("displaymethod", displaymethod)
    }

    displayMethodAux = displaymethod;

    todos = JSON.parse(todos);

    if (todos) {
        displaymethod = 0;
        for (let i = 0; i < todos.length; i++) {
            new item(todos[i].name, todos[i].check_flag, todos[i].star_flag, 0, todos[i].creation_date);
        }
        displaymethod = displayMethodAux;
    }
    else {
        todos = [];
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }
}


deleteAllBtn.addEventListener("mouseover", function (e) {
    e.currentTarget.classList.remove("far")
    e.currentTarget.classList.add("fas")
})

deleteAllBtn.addEventListener("mouseout", function (e) {
    e.currentTarget.classList.remove("fas")
    e.currentTarget.classList.add("far")
})

deleteAllBtn.addEventListener("click", function (e) {
    localStorage.clear()
    todos = []
    console.log("testingcdcdcdcdc")
    tasks.innerHTML = '';
})


function main() {
    loadLocalStorage();

    addTodoBtn.addEventListener('click', addTodo);
    window.addEventListener('keydown', (e) => {
        if (e.which == 13) {
            addTodo();
        }
    })
    console.log("Exista " + todos.length + " task-uri.");
}

main()
