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

	if(strData){
		var obj ={};

		for(var i=0; i<strData.length;i++){
			obj = JSON.parse(strData[i]);				
			obj.updated = new Date(obj.updated);
			
			$('#table-header').after("<tr><td><input type='checkbox' " + chkboxState(obj.done) + "></input></td>\
									 <td>"+obj.title+"</td><td>"+obj.author+"</td>\
									 <td>"+check10(obj.updated.getDate())+"."
									 +check10(obj.updated.getMonth()+1)+"."
									 +obj.updated.getFullYear()
									 +" "+check10(obj.updated.getHours())+":"
									 +check10(obj.updated.getMinutes())+"</td></tr>");
		}
			
			// $('#tskTable'+' td:nth-child(2)').attr('contenteditable','true');
			// $('#tskTable'+' td:nth-child(3)').attr('contenteditable','true');
	}
    else strData = [];

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





$(document).ready(
	function(){
		var taskList = readLocalStorage();

		console.log(taskList);
		
		$('#btnAddTask').click(
			function(){

					// if(logItem.title == ""){
					//    $('#tsk_title').addClass("set-warning");
					// }
					// else if(logItem.author == ""){
					// 	        $('#tsk_title').removeClass("set-warning");
					// 			$('#tsk_auth').addClass("set-warning");
					// }
					// else{
					// 	$('#tsk_title').removeClass("set-warning");
					// 	$('#tsk_auth').removeClass("set-warning");
					// 	$('#tsk_title').val("");$('#tsk_auth').val("");
						
						if(validateInputFields()){
							addTask(taskList);	
							$('#tsk_title').val(""); $('#tsk_auth').val("");
						}

					//}	
			});
		
	});