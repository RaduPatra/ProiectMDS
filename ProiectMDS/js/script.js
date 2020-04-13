function deleteParentElement (){
	var icon = document.getElementsByClassName("fal fa-trash-alt delete-task")
	
	for (var i = 0; i < icon.length; i++) {
	  	icon[i].addEventListener('click', function(e) {
			e.currentTarget.parentNode.remove();
			}, false);
	}
}

window.onload = function(){
	deleteParentElement()//butoanele de trash can la apasare sterg div-ul parinte
}
