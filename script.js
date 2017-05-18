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

	return taskItem;
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
	}
}



$(document).ready(
	function(){
		window.WTDL_num = 0;

		var taskList = readLocalStorage();
		drawTable(taskList);

		$('#btnAddTask').click(
			function(){
						if(validateInputFields()){
							drawTable(addTask(taskList));	
							$('#tsk_title').val(""); $('#tsk_auth').val("");
						}
		});

		$('html').on('click','#tskTable tr',   //binding handler for dynamic generated tags
			function(){
    			$(this).toggleClass('tsk-selected');
    			if($(this).hasClass('tsk-selected')){
    			   $('#btnDel').remove();  
    			   $(this).append("<button id=\"btnDel\">Delete</button>");

    			   $('#btnDel').click(
    			   		function(){
    			   			taskList = delTask(readLocalStorage(),$('#btnDel').parent().attr('id'));

    			   			for(var i=0; i<=window.WTDL_num; i++) $('#'+i).remove();

    			   			window.WTDL_num--;
							drawTable(taskList);			   		
    			   	});
    			}
    			else $('#btnDel').remove();
		});
});
