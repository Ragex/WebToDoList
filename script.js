function check10(num)
{
	return (num < 10)? "0"+num : num;
}


function chkboxState(state)
{
	return (state)? "checked": "";
}


function readLocalStorage()
{
	var strData = JSON.parse(localStorage.getItem('WTDL')); 	

	if(!strData) strData = [];

    return strData;
};


function addTask(storage)
{
	var date = new Date(),
	    taskItem = {};

	taskItem.id 	 = +date;
	taskItem.done    = false;
	taskItem.title   = $('#tsk_title').val(),
	taskItem.author  = $('#tsk_auth').val(),					
	taskItem.updated = date;

	storage.push(JSON.stringify(taskItem));
	localStorage.setItem('WTDL',JSON.stringify(storage));

	return taskItem;
}


function validateInputFields()
{
	if(!$('#tsk_title').val()) $('#tsk_title').addClass("set-warning");
	else if(!$('#tsk_auth').val()){
			$('#tsk_title').removeClass("set-warning");
	 		$('#tsk_auth').addClass("set-warning");
		}
		else{
			 $('#tsk_title').removeClass("set-warning"); 
			 $('#tsk_auth').removeClass("set-warning");
			 return true;
		}

	return false;
}


function drawTable(tasks)
{
	var obj ={};

	if(tasks.length >= 0){			//if we have an empty array. In this case array.length = 0;
  		for(var i=0; i<tasks.length;i++){
			obj = JSON.parse(tasks[i]);				
			obj.updated = new Date(obj.updated);
			
			$('#table-header').after("<tr><td><input type='checkbox' " + chkboxState(obj.done) + "></input></td>\
									 <td>"+obj.title+"</td><td>"+obj.author+"</td>\
									 <td>"+check10(obj.updated.getDate())+"."
									 +check10(obj.updated.getMonth()+1)+"."
									 +obj.updated.getFullYear()
									 +" "+check10(obj.updated.getHours())+":"
									 +check10(obj.updated.getMinutes())+"</td></tr>");
		}
	}
	else{ //if we have only one task, array.length = undifined;
		 $('#table-header').after("<tr><td><input type='checkbox' " + chkboxState(tasks.done) + "></input></td>\
									<td>"+tasks.title+"</td><td>"+tasks.author+"</td>\
									<td>"+check10(tasks.updated.getDate())+"."
									+check10(tasks.updated.getMonth()+1)+"."
									+tasks.updated.getFullYear()
									+" "+check10(tasks.updated.getHours())+":"
									+check10(tasks.updated.getMinutes())+"</td></tr>");
	}
}



$(document).ready(
	function(){
		var taskList = readLocalStorage();
		drawTable(taskList);

		$('#btnAddTask').click(
			function(){
						if(validateInputFields()){
							drawTable(addTask(taskList));	
							$('#tsk_title').val(""); $('#tsk_auth').val("");
						}
		});

		$('html').on('click','#tskTable tr',
			function(){
    			$(this).toggleClass('tsk-selected');
    			if($(this).hasClass('tsk-selected')) $(this).append("<button id=\"btnDel\">Delete</button>");
    			else $('#btnDel').remove();
		});
});
