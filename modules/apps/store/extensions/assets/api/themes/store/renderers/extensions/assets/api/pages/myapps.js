var render = function (theme, data, meta, require) {
    var log = new Log();

    log.info('Rendering myapps');
    theme('2-column-right',{
        title:'test',
        body:[
            {
                partial:'myapps',
                context:{name:'a'}
            }
        ]
    });
}