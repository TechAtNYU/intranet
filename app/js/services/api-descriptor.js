angular
.module( "app.services" )
.factory( "apiDescriptor", ( Restangular ) => {
    "use strict";

    return Restangular.all( "" ).getList()
		.then( ( data ) => {
    data = {
        "data": data,
        "resource": function( name ) {
            return _.find( data.data, ( r ) => {
                return r.id === name;
            } );
        }
    };
    return data;
} );
} );
