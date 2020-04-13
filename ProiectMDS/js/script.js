class item {
    constructor(name) {
        this.createItem(name);
    }
    createItem(name) {
        var task = document.createElement('div');
        var check = document.createElement('i');
        var input = document.createElement('p');
        var remove = document.createElement('i');

        task.classList.add('task');
        input.textContent = name;

        input.classList.add('text');
        check.classList.add("far", "fa-circle", "unchecked");
        remove.classList.add("fal", "fa-trash-alt", "delete-task");
        remove.addEventListener('click', function(e) {
			e.currentTarget.parentNode.remove();
		  }, false);

        tasks.appendChild(task);
        task.appendChild(check);
        task.appendChild(input);
        task.appendChild(remove);
    }

}
