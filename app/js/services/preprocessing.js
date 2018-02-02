angular
.module( "app.services" )
.factory( "preProcess", ( $filter, Restangular, formatTeamDisplayFilter ) => {
    "use strict";
    return {
        "displayDate": function( filter ) {
            return function( date ) {
                return filter( "date" )( date, "MMMM yyyy" );
            };
        },
        "objectIdtoName": function( name ) {
            const objectIdToName = {};

            Restangular.all( name )
                .getList()
                .then( ( objectName ) => {
                    _.each( objectName, ( element ) => {
                        objectIdToName[ element.id ] = element.attributes.name;
                    } );
                } );
            return objectIdToName;
        },
        "positionToString": function( teamMap, element, includeLead ) {
            if ( includeLead ) {
                return formatTeamDisplayFilter( teamMap[ element.relationships.team.data.id ], element.attributes.isLead );
            }

            return formatTeamDisplayFilter( teamMap[ element.relationships.team.data.id ], false );
        }
    };
} );
