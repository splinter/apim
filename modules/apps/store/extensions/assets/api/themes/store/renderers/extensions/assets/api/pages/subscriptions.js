var render=function(theme,data,meta,require){
     var log=new Log();
     log.info('Rendering subscriptions');

     theme('2-column-right',{
         title: 'Subscriptions',
         body:[
             {
                 partial:'subscriptions'
             }]
     });
};