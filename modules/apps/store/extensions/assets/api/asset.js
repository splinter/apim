

var assetLinks=function(user){

    return{
        title:'API' ,
        links:[
            {
                 title:'Custom',
                 url:'custom',
                 path:'custom.jag'
            } ,
            {
                title:'My Applications',
                url:'myapps',
                path:'myapps.jag'
            }
        ]
    }
};

var assetManager=function(manager){
    var add=manager.add;
    var log=new Log('asset');

    log.info('Custom asset manager loaded');

    //Override the add actions of the API
    manager.add=function(options){
        add.call(manager,options);
    };

    return manager;
};