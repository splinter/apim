var render = function (theme, data, meta, require) {
    theme('2-column-right',{
        title:'My Applications',
        header:[
            {
                partial:'header',
                context: {}
            },
            {
                partial:'navigation',
                context:{}
            }
        ],
        body:[
            {
                partial:'myapps',
                context:data
            }
        ]
    });
}