var render = function (theme, data, meta, require) {

    theme('2-column-right', {
        title: 'Subscriptions',
        header: [
            {
              partial:'header',
              context:{}
            },
            {
                partial: 'navigation',
                context: {}
            }
        ] ,
        body:[
            {
                partial:'subscriptions',
                context:{}
            }
        ]
    });
};