const tasks = document.querySelector('.tasks');
var inputValue = document.querySelector('.todoinput');
const addTodoBtn = document.querySelector('.createtodo');
const sortByFav = document.querySelector('.sortByFav');
const sortByDate = document.querySelector('.sortByDate');
const deleteAllBtn = document.querySelector('.deleteAll');
var workSpacesCount = 1; // = 1 doar ca momentan nu este implementare pt local storage
var current_workspace = 1
var workspaces = []

//Aici se face citirea din localStorage
var displaymethod = window.localStorage.getItem("displaymethod");
var todos = window.localStorage.getItem("todos");

//functie care deschide navigatia
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

//functie care ascunde navigatia
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
} 

//Functia searchObj are ca scop cautarea unui Task dupa numele sau in array-ul de Task-uri. Daca se gaseste este returnat indicele, iar daca nu se intoarce -1
function searchObj(nume) {
    for (i = 0; i < todos.length; i++) {
        if (todos[i].name == nume) {
            return i;
        }
    }
    return -1;
}


//Functia are ca scop intoarcerea ultimului task in care a fost activata functia "favorite"
//tasks trebuie sa fie sortate descr dupa numarul de stele
function findLastStar() {
    for (i = 0; i < todos.length; i++) {
        if (todos[i].star_flag == 0) {
            return i;
        }
    }
    return todos.length;
}

//Folosim addTimeEvent pentru a adauga butonul de alarma si ca acesta sa se modifica cand trece dintr-o stare in alta
function addTimeEvent(date, i) {

    date.addEventListener('click', function (e) {
        if (date.classList.contains("fal")) {
            //Daca butonul de alarma este inactiv
            date.classList.remove("fal")
	    // modificam iconita astfel incat sa fie activa
            date.classList.add("fas")

            document.getElementsByClassName("inputMinute")[i].style.display = "inline"
        }

        else if (date.classList.contains("fas")) {
            //Daca butonul de alarma este activ
            for (i of document.getElementsByClassName("countdown"))
                i.style.display = "none"

            date.classList.remove("fas", "fa-alarm-clock")
            date.classList.add("far", "fa-alarm-exclamation")
	    // schimbam iconita cu cea pentru timp expirat
        }

        else if (date.classList.contains("far")) {
            //Daca butonul de alarma este "expirat"
            date.classList.remove("far", "fa-alarm-exclamation")
	    // iconita redevine inactiva
            date.classList.add("fal", "fa-alarm-clock")
        }
    }, 0)

    return date
}

//Rolul functiei getInputObject este de a crea un "input" pentru countdown-ul de la alarma. Acesta modifica alarma intr-un input unde se introduce numarul de minute.
function getInputObject(i) {
    var inputMinute = document.createElement("INPUT");
    inputMinute.setAttribute("type", "number");
    inputMinute.placeholder = "Introduceti nr minute"
    inputMinute.classList.add("inputMinute")
    inputMinute.value = ""
    inputMinute.style.display = "none"



//Cand se apasa tasta "ENTER" se inregistreaza inputul, parsam minutele si secundele, facem countdown si revenim la icon-urile alarmei. 
    inputMinute.addEventListener('keydown', (e) => {
        if (e.which == 13) {
            if (e.currentTarget.value != "") {
                var cnt = document.getElementsByClassName("countdown")
                cnt[i].style.display = "inline"
                e.currentTarget.style.display = "none"

                var val = e.currentTarget.value
                var d = new Date()

                var x = setInterval(function () {
                    var now = new Date()
                    var valoare = ((val * 60) - parseInt((now - d) / 1000))//numar secunde

                    //parse time
                    let mins = parseInt(valoare / 60)
                    let secs = parseInt(valoare % 60)
                    let string = mins + ":" + secs

                    cnt[i].innerHTML = "<p>" + string + "</p>"
			
			// daca timpul < 0 sau daca s-a dat clear interval in alta parte
                    if (valoare < 0 || cnt[i].style.display == "none") {
                       clearInterval(x)

                        cnt[i].style.display = "none"
                        //schimbam incon pentru alarma
                        var ceas = document.getElementsByClassName("alarma")
                        ceas[i].classList.remove("fas", "fa-alarm-clock")
                        ceas[i].classList.add("far", "fa-alarm-exclamation")
                        //Cand ajunge la 0 cu timer-ul pornim un sunet de alarma si primim o alerta
                        if (valoare < 0){
                            alert("Countdown over!")
                            var jador = new Audio('/audio/beep.wav');
                            jador.play();// canta alarma

                        }
                    }
                }, 1000)

            }
        }
    })

    return inputMinute
}

//Functia sort-eaza prima data in localStorage, dupa schimba metoda de inserare si le reinsereaza sortate cand se da click pe buton
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


//Functia are aceasi functionalitate ca si sortByFav doar ca face sort dupa data in local storage, dupa schimba inserarea si reinsereaza task urile in ordinea sortata
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

//Clasa principala de care se foloseste tot proiectul. Un obiect de tip item este un task
class item {
    constructor(name, f1 = 0, f2 = 0, f3 = 0, f4 = 0) {
        //Avem un constructor pentru nume si flag uri. Mereu cand se apeleaza constr apelam si functia createItem
        this.name = name;
        this.check_flag = f1;
        this.star_flag = f2;
        this.alarm_flag = f3;
        this.creation_date = f4;

        if (displaymethod != 0) {
            var date = new Date();
            var timestamp = date.getTime();
            this.creation_date = timestamp;
        }

        this.createItem(name, f1, f2, f3);
    }
//createItem creaza div-ul pentru task, icon-urile pentru butoanele de alarma, favorite, stergere si check si butonul de editare a task-ului si adauga stilizare acestora
    createItem(name, f1, f2, f3) {
        var task = document.createElement('div');
        var dropdowndiv = document.createElement('div');
        var dropdowncontent = document.createElement('div');
        var options = document.createElement('i');
        var check = document.createElement('i');
        var input = document.createElement('p');
        var remove = document.createElement('i');
        var editbtn = document.createElement('button');
        var star = document.createElement("i");


        editbtn.classList.add("edit-task", "fa", "fa-edit");
        task.classList.add('task');
        //textul afisat vine de la constr
        input.textContent = name;
        input.classList.add('text');
        input.contentEditable = "false";

        dropdowndiv.classList.add('dropdown');
        dropdowncontent.classList.add('dropdown-content');

        //event listeners
        check = this.checkIcon(check, input, this, f1);
        remove = this.removeIcon(remove, name, task);
        editbtn = this.editTask(editbtn, name, input);
        options = this.optionIcon(options, dropdowncontent, name);
        star = this.starIcon(star, this, f2);

        //load from storage insert mode
        if (displaymethod == 0)
            tasks.appendChild(task);

        //sort by stars insert mode
        if (displaymethod == 1) {
            var lastStarInd = findLastStar();
            tasks.insertBefore(task, tasks.children.item(lastStarInd))
        }

        //sort by date mode
        if (displaymethod == 2) {
            tasks.insertBefore(task, tasks.firstChild);
        }

         //dam append diverselor icons si btn in div-ul taskului 
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(star);
        task.appendChild(dropdowndiv);
        //append pt dropdown
        dropdowndiv.appendChild(options);
        dropdowndiv.appendChild(dropdowncontent);
        dropdowncontent.appendChild(remove);
        dropdowncontent.appendChild(editbtn);
                //De aici incepe drag, drop and swap folosind .draggable si .droppable din jquery
        //Este comentat in intregime deoarece avem un bug major si nu am reusit sa il rezolvam in timp util
        // $(document).ready(function (){
        //     $( function() {
        //pentru un element de tip task pe care dam click va primi tag ul draggable
        //         $( task ).draggable({
        //                 axis: "y",
        //                 containment: "parent",
        //                 revert: true,

        //                 start: function() {
        //                     $(this).css({opacity:0.5});
        //                 },
        //                 stop: function() {
        //                     $(this).css({opacity:1})
        //                 }
        //             });
        //         $( task).droppable({
        //                 accept: ".task",
        //                 drop: function(event, ui) {
                            //luam pozitia taskului draggable si a celui droppable si le interschimbam
                            //extragem pozitiile
        //                     var draggable = ui.draggable;
        //                     var droppable = $(this);
        //                     var dragPos = draggable.position();
        //                     var dropPos = droppable.position();
        //                     console.log(dragPos + "drop:" + dropPos)
                                //facem interschimbarea
        //                     draggable.css({
        //                         left: dropPos.left + "px",
        //                         top: dropPos.top + "px",
        //                     });
        //                     droppable.animate({
        //                         left: dragPos.left + "px",
        //                         top: dragPos.top + "px"                     
        //                     })
        //                 }
        //         })
        //     } );
        // })
        //cream un div secund pentru alarma folosind functia creareDivInput
        var divSecund = this.creareDivInput(f3, name, dropdowncontent);
        task.appendChild(divSecund);

    }

    //creem un div nou pentru input ul de la alarma
    creareDivInput(flag, name, dropdowncontent) {
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

        //ii dam append la div si il returnam
        dropdowncontent.appendChild(addTimeEvent(date, searchObj(name)))
        console.log(div);
        div.appendChild(getInputObject(searchObj(name)))

        var x = document.createElement('p')
        x.classList.add("countdown")
        div.appendChild(x)

        return div
    }

    //adauga functionalitate butonului de check(cel care da crossout unui task)
    checkIcon(check, input, obj, flag) {
            //Initializare pentru check si uncheck
        if (flag == 1) {
            check.classList.add("far", "fa-check-circle");
            input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
        }
        else {
            check.classList.add("far", "fa-circle", "unchecked");
        }
         //Un efect de hover 
        check.addEventListener('mouseover', function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-circle", "unchecked");
                e.currentTarget.classList.add("fa-dot-circle");
            }
        }, false);
        //reverse la efectul de hover
        check.addEventListener("mouseout", function (e) {
            if (!e.currentTarget.classList.contains("fa-check-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle");
                e.currentTarget.classList.add("fa-circle", "unchecked");
            }
        }, false);

        check.addEventListener('click', function (e) {
            //da check
            var defaultstyle = input.style;
            //Cand se da click pe butonul de check ii dam crossout si il stilizam
            if (e.currentTarget.classList.contains("fa-dot-circle")) {
                e.currentTarget.classList.remove("fa-dot-circle");
                e.currentTarget.classList.add("fa-check-circle");
                input.style.cssText = "text-decoration:line-through ; color:gray; opacity: 60%";
                obj.check_flag = 1;
            }
            else {
                //Cand dam uncheck dam revert la ce am facut mai sus
                e.currentTarget.classList.remove("fa-check-circle");
                e.currentTarget.classList.add("fa-circle", "unchecked");
                input.style.removeProperty("text-decoration", "line-through");
                input.style = defaultstyle;
                obj.check_flag = 0;
            }
            //local storage    
            var ind = searchObj(obj.name);
            todos[ind] = obj;
            //local storage  
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }, false);

        return check;
    }

    //Functia editTask are ca scop adaugare functionalitatii pentru butonul de edit. Cand apasam btn textul devine un input pe care putem sa il modificam
    editTask(editbtn, name, input) {

        editbtn.addEventListener("click", function (e) {

            /*editbtn.addEventListener("keypress", function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                }
            });*/
            //cautam task-ul pe care dorim sa il modificam in lista de task-uri
            var ind = searchObj(name);

            if (input.contentEditable == "false") {
                //daca nu a fost inca apasat butonul intram in modul de edit
                input.contentEditable = "true";
                input.focus();
                editbtn.classList.remove("edit-task", "fa", "fa-edit");
                editbtn.classList.add("save-edit", "fal", "fa-clipboard-check");

                //save on enter
                input.addEventListener("keypress", function (event) {
                    if (event.keyCode == 13) {
                        //revenim la forma initiala a task-ului
                        input.contentEditable = "false"
                        editbtn.classList.add("edit-task", "fa", "fa-edit");
                        editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");
                        //il modificam in vectorul de task-uri 
                        todos[ind].name = input.textContent;
                        //cat si in localStorage
                        window.localStorage.setItem("todos", JSON.stringify(todos));
                    }
                });
            }
            else {
                //Daca mai apasam inca o data pe buton salvam modificarile facute si in localStorage
                input.contentEditable = "false";
                editbtn.classList.add("edit-task", "fa", "fa-edit");
                editbtn.classList.remove("save-edit", "fal", "fa-clipboard-check");

                todos[ind].name = input.textContent;
                window.localStorage.setItem("todos", JSON.stringify(todos));
            }
        })

        return editbtn;
    }
    //Initializeaza behavior-ul icon-ului 
    removeIcon(remove, name, task) {
        remove.classList.add("fal", "fa-trash-alt", "delete-task");
        remove.addEventListener("click", function (e) {
        //cand se da click se sterge din array ul de task uri 
            console.log(e.currentTarget.parentNode);
            task.remove();
            let ind = searchObj(name);
            todos.splice(ind, 1);
            //si din localstorage
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }, false);

        return remove;
    }

    //Initializeaza behavior-ul meniului nou adaugat de optiuni-ului 
    optionIcon(options, dropdowncontent, name) {
        options.classList.add("options", "far", "fa-ellipsis-v");
        options.addEventListener("click", function (e) {

            dropdowncontent.classList.toggle("show");

        }, false);

        return options;
    }

    //initializez behavior-ul butonului de fav
    starIcon(star, obj, flag) {
         //daca este deja activat il schimb cu cel neactivat si vice versa
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

//Functia adauga un task nou apland constructorul de la clasa Item
function addTodo() {

    if (inputValue.value != "") {

        if (searchObj(inputValue.value) != -1) {
            alert("Exista deja acest To-Do!");
            return;
        }
         //apeleaza constr de la clasa item
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
        //adauga in local storage
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }
}

//functia de prelucrare a datelor din local storage. 
function loadLocalStorage() {
    //localStorage.clear()

    //cand le scoatem din local storage
    //daca nu au fost citite bine reinitializam displaymethod pentru sortari
    if (displaymethod == null) {
        displaymethod = 2;
        window.localStorage.setItem("displaymethod", displaymethod)
    }

    displayMethodAux = displaymethod;
    //ii dam parse
    todos = JSON.parse(todos);
    //apelam constructorul pentru fiecare item din localStorage
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
  // workSpacesCount = window.localStorage.getItem("workSpacesCount")

    //if (workSpacesCount)//daca nu exista in local storage o valoare
    	//workSpacesCount = 1 //atunci este egal cu 1
}
function createWorkSpace(){
	//creem un nou div pentru a retine task-uri
	var newDiv = document.createElement("div")
	newDiv.classList.add("tasks")

	workSpacesCount += 1 //incrementam counter-ul si il bagam in local storage
	window.localStorage.setItem("workSpacesCount", workSpacesCount)

	//setam id-ul workspace-ului
	newDiv.id = workSpacesCount

	//il introducem in pagina
	var bigDiv = document.getElementsByClassName("todo-list")[0]
	bigDiv.appendChild(newDiv);

	//adaugam in lista din navbar acest workspace
	let listaDeListe = document.getElementsByClassName("list-of-lists")[0]

	var newList = document.createElement("p")
	
	//la click schimba workspace-ul cu cel creat mai sus
	newList.addEventListener('click', function(e){
		// let x = document.getElementsByClassName("tasks")
		// for (i = 0; i < x.length; i++){
		// 	x[i].style.display = "none"
		// }
		document.getElementById(current_workspace).style.display = "none"
		// alternativa pentru codul comentat mai sus

		document.getElementById(workSpacesCount).style.display = "inline"
		current_workspace = workSpacesCount
		todos = workspaces[current_workspace - 1]
	}, 1)

	// numele afisat in sidevar
	newList.innerText = "List no. " + workSpacesCount

	// div pentru nume si iconita de stergere
	var newContentDiv = document.createElement("div")
	newContentDiv.classList.add('sidenav-element')

	// iconita de stergere
	var deleteIcon = document.createElement('i')
	deleteIcon.classList.add('fas', 'fa-trash-alt')

	deleteIcon.addEventListener('click', function(e){
		document.getElementById(workSpacesCount).innerHTML = ""

		// div ul parinte(de mai sus)
		let divParinte = e.currentTarget.parentNode
		divParinte.parentNode.removeChild(divParinte)

		// prima lista din lista de liste
		let taskCurent = document.getElementsByClassName("tasks")[0]
		taskCurent.style.display = "block"

		current_workspace = taskCurent.id
		todos = workspaces[current_workspace - 1]
	}, 1)

	newContentDiv.appendChild(newList)
	newContentDiv.appendChild(deleteIcon)

	listaDeListe.appendChild(newContentDiv)

}

function initFirstWorkSpace(){
	// functie pentru initializarea butonului de a schimba
	// workspace-ul cu primul ws
	let deInit = document.getElementsByClassName("deInit")//pair

	//paragraful cu numele listei
	deInit[0].addEventListener('click', function(e){
		// 
		document.getElementById(current_workspace).style.display = "none"
		document.getElementById(1).style.display = "block"
		current_workspace = 1
		todos = workspaces[current_workspace - 1]
	}, 1)

	//buton de stergere
	deInit[1].addEventListener('click', function(e){
		document.getElementById(1).innerHTML = ""

		// div ul parinte
		let divParinte = e.currentTarget.parentNode
		divParinte.parentNode.removeChild(divParinte)

		//prima lista din sidebar
		let taskCurent = document.getElementsByClassName("tasks")[0]
		taskCurent.style.display = "block"

		current_workspace = taskCurent.id
		todos = workspaces[current_workspace - 1]

	}, 1)


	//TO DO de adaugat event pt hover 
}

// deleteAllBtn.addEventListener("mouseover", function (e) {
//     e.currentTarget.classList.remove("far")
//     e.currentTarget.classList.add("fas")
// })

// deleteAllBtn.addEventListener("mouseout", function (e) {
//     e.currentTarget.classList.remove("fas")
//     e.currentTarget.classList.add("far")
// })


//cand se apasa butonul de delte all stergem tot din vectorul de task uri si din localStorage
deleteAllBtn.addEventListener("click", function (e) {
    localStorage.clear()
    todos = []
    tasks.innerHTML = '';
})

//Functia main
function main() {
    for (i = 0; i < 30; i++){
    	workspaces[i] = []
    }
    //apelam functia de prelucrare a datelor din localstorage
    loadLocalStorage();
    initFirstWorkSpace();//cat si a workspace-ului
    
    
    //cand se insereaza textul si se apasa "ENTER" se apeleaza functia de adaugare a unui task nou
    window.addEventListener('keydown', (e) => {
        if (e.which == 13) {
            addTodo();
        }
    })
}

main()
