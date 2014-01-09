var log=new Log();

var resources= function (page,meta){

    log.info('Resource helper for myapp');

    return{
        js:['logic/common/console.js','logic/myapp/add-app.js','logic/myapp/list-apps.js']
    } ;
};