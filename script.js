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
	try{
		localStorage.setItem('WTDL',JSON.stringify(storage));
	} catch(err){
		if(err == QUOTA_EXCEEDED_ERR) alert('Local storage is overflow. Please delete some finished tasks.');		
	}
}


function delTask(storage,id)
{
	storage.splice(id,1);
	localStorage.setItem('WTDL',JSON.stringify(storage));
	return storage;
}


function validateInputFields()
{
	if(!$('#tsk_title').val().trim()) $('#tsk_title').addClass("set-warning");
	else if(!$('#tsk_auth').val().trim()){
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

	for(var i=0; i<=window.WTDL_num; i++) $('#'+i).remove();

	if(tasks.length >= 0){			//if we have an empty array. In this case array.length = 0;
  		for(var i=0; i<tasks.length;i++){
			obj = JSON.parse(tasks[i]);				
			obj.updated = new Date(obj.updated);
			
			$('#table-header').after("<tr id='" +i+ "'><td><input type='checkbox' " + chkboxState(obj.done) + "></input></td>\
									 <td>"+obj.title+"</td><td>"+obj.author+"</td>\
									 <td>"+check10(obj.updated.getDate())+"."
									 +check10(obj.updated.getMonth()+1)+"."
									 +obj.updated.getFullYear()
									 +" "+check10(obj.updated.getHours())+":"
									 +check10(obj.updated.getMinutes())+"</td></tr>");

			if(chkboxState(obj.done)) $('#'+i).addClass('tsk-complite');
		}
		window.WTDL_num = i-1;
	}
	else{ //if we have only one task, tasks.length = undifined.
		 window.WTDL_num++;
		 $('#table-header').after("<tr id='" +window.WTDL_num+ "'><td><input type='checkbox' " + chkboxState(tasks.done) + "></input></td>\
									<td>"+tasks.title+"</td><td>"+tasks.author+"</td>\
									<td>"+check10(tasks.updated.getDate())+"."
									+check10(tasks.updated.getMonth()+1)+"."
									+tasks.updated.getFullYear()
									+" "+check10(tasks.updated.getHours())+":"
									+check10(tasks.updated.getMinutes())+"</td></tr>");

		 if(chkboxState(obj.done)) $('#'+i).addClass('tsk-complite');
	}
}


function updTask(operate, storage, id, newData)
{
	var task = JSON.parse(storage[id]);	

	switch(operate){
		case 0: //set task state (checkbox)
				task.done = newData;			
				break;
		case 1: //upd task title
				task.title = newData;
				break;
		case 2: //upd task author
				task.author = newData;
				break;
		default:
				storage[id] = JSON.stringify(task);
				return storage;
	
	}

	task.updated = new Date();
	storage[id] = JSON.stringify(task);
 	localStorage.setItem('WTDL',JSON.stringify(storage));

	return storage;
}



$(document).ready(
	function(){
		window.WTDL_num = 0;

		var taskList = readLocalStorage();
		drawTable(taskList);

		$('#btnAddTask').click(
			function(){
						if(validateInputFields()){
							addTask(taskList)
							drawTable(taskList);	
							$('#tsk_title').val(""); $('#tsk_auth').val("");
						}
		});

		$('html').on('click','#tskTable td',   //binding handler for dynamic generated tags
			function(){
    			$(this).parent().toggleClass('tsk-selected');
    			if($(this).parent().hasClass('tsk-selected')){
    			   $('#btnDel').remove();  
    			   $(this).parent().append("<button id=\"btnDel\">Delete</button>");

    			   $('#btnDel').click(
    			   		function(){
    			   			taskList = delTask(readLocalStorage(),$('#btnDel').parent().attr('id'));   			   			
							drawTable(taskList);	
							window.WTDL_num--;		   		
    			   	});
    			}
    			else $('#btnDel').remove();
		});

		$('html').on('dblclick','#tskTable td:nth-child(2), td:nth-child(3)',   //binding handler for dynamic generated tags
			function(){
				$(this).attr('contenteditable',true);
				
				$(this).focus();
				$(this).blur(
					function(){
						$(this).attr('contenteditable',false);

						taskList = updTask($(this).prop('cellIndex'), taskList,$(this).parent().attr('id'),
										   $(this).prop('textContent'));
				});

		});

		$('html').on('click','#tskTable input',
			function(){
				if($(this).is(':checked')){
					taskList = updTask(0, taskList,$(this).parent().parent().attr('id'), true);
					$(this).parent().parent().addClass('tsk-complite');
				}
				else{
				 	 $(this).parent().parent().removeClass('tsk-complite');
				 	 taskList = updTask(0, taskList,$(this).parent().parent().attr('id'), false);
				}

				drawTable(taskList);
		});


});
