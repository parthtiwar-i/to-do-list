$("#addButton").on("click",  ()=>{
   let value = $("#userInputValue").val();
   if (value==="") {
    alert("enter the task for list ") 
   }
   else{
   $(".listItems").append('<div class="items"><input type="checkbox" /><p class="px-5">'+ value +'</p></div>');
   setTimeout(function() {
       $("#userInputValue").val("");
   }, 0); 
};
});
