angular
.module( "app.services" )
.factory( "dataTransformer", ( Restangular ) => {
    "use strict";

    return {
		// Transforms the linking fields on a model from being located at
		// model[field.name] to the required structure for linking resources
		// in the JSON API specification
        "relink": function( model, rdesc ) {
            const links = {};

            _.each( rdesc.attributes.fields, ( field ) => {
                const fieldType = field.kind[ "base-type" ];
                const fieldTargetType = field.kind[ "target-type" ];
                const fieldArray = field.kind[ "is-array" ];

                if ( fieldType === "Relationship" ) {
                    let linkage = null;

                    if ( fieldArray ) {
                        linkage = _.map( model.attributes[ field.name ], ( value ) => {
                            return {
                                "type": fieldTargetType,
                                "id": value
                            };
                        } );
                    } else if ( model.attributes[ field.name ] ) {
                        linkage = {
                            "type": fieldTargetType,
                            "id": model.attributes[ field.name ]
                        };
                    } else {
                        linkage = null;
                    }

                    links[ field.name ] = { "data": linkage };
                    delete model.attributes[ field.name ];
                }
            } );

            model.relationships = links;
            return model;
        },
		// The inverse of the above transformation; given a model in JSON API
		// format, takes all elements in its links property and makes them into
		// a normal, flat object
        "delink": function( model ) {
            const links = model.relationships;

            _.each( links, ( link, name ) => {
                const linkage = link.data;
				// This is primarily to omit the 'self' property

                if ( !linkage ) {
                    return;
                } else if ( _.isArray( linkage ) ) {
                    model.attributes[ name ] = _.pluck( linkage, "id" );
                } else {
                    model.attributes[ name ] = linkage.id;
                }
            } );
            return model;
        },

		// Fetches linked resources and stores them in $scope.data for typeahead
		// callback = $scope.refreshData
        "loadLinkedData": function( rdesc, callback ) {
            const data = {};

            _.each( rdesc.attributes.fields, ( field ) => {
                const fieldBaseType = field.kind[ "base-type" ];
                const fieldTargetType = field.kind[ "target-type" ];

                if ( fieldBaseType === "Relationship" && !( fieldTargetType in data ) ) {
                    callback( data, fieldTargetType );
                }
            } );
            return data;
        },

        "updateResource": function( model, rdesc, resource, callback ) {
            const finalModel = this.relink( angular.copy( Restangular.stripRestangular( model ) ), rdesc );

            rdesc.attributes.fields.forEach( ( field ) => {
                if ( field.validation[ "read-only" ] && field.name !== "id" ) {
                    delete finalModel.attributes[ field.name ];
                }
            } );
            return resource.patch( finalModel )
			.catch( ( err ) => {
    alert( `Could not submit to resource. API returned the following error: ${ err.data.errors[ 0 ].title}` );
} );
        },

        "createResource": function( model, rdesc, resource ) {
            const finalModel = this.relink( angular.copy( Restangular.stripRestangular( model ) ), rdesc );

            finalModel.type = rdesc.id;

            return resource.post( finalModel )
			.catch( ( err ) => {
    alert( `Could not submit to resource. API returned the following error: ${ err.data.errors[ 0 ].title}` );
} );
        },

        "deleteResource": function( resourceName, id, callback ) {
            return Restangular.one( resourceName, id ).remove()
			.catch( () => {
    alert( "Could not delete the entry" );
} );
        }
    };
} );
