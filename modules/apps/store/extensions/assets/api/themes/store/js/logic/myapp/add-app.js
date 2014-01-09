/*
Description: The following script is used to perform addition of an application
Created Date: 9/1/2014
Filename:add-app.js
 */
$(function(){
   console.info('Loaded add-app logic');

   var initFormSubmissionLogic=function(){

       $('#btnAddApp').on('click',function(){

            console.info('Add App button clicked');

            var data=readAppForm();

            //Read the data
            console.info('User entered data: '+JSON.stringify(data));
       });
   };

   /*
   The function creates a data object containing the application information entered by the user
    */
   var readAppForm=function(){
       var data={};
       data['application']=$('#appName')?$('#appName').val():'empty';
       data['tier']= $('#appTier')?$('#appTier').val():'empty';
       data['callbackUrl']=$('#appCallbackURL')?$('#appCallbackURL').val():'empty';
       data['description']=$('#appDescription')?$('#appDescription').val():'empty';

       return data;
   };

   initFormSubmissionLogic();
});