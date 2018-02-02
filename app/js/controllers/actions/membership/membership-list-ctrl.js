"use strict";

angular
.module( "app.controllers" )
.controller( "MembershipListCtrl", ( $scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer, preProcess ) => {
    const resourceName = $stateParams.resourceName;
    const resourceId = $stateParams.id;

    $scope.resourceName = resourceName;
    apiDescriptor.then( ( apiDescription ) => {
        $scope.rdesc = apiDescription.resource( resourceName );
    } );

    var teamsIdToName = {};

    $scope.displayActivity = function( isActive ) {
        return isActive ? "Active Members" : "Inactive Members";
    };

	// mapping teamID to teamName
    var teamsIdToName = preProcess.objectIdtoName( "teams" );

    Restangular.all( resourceName )
	.getList()
	.then( ( data ) => {
    $scope.data = data;
    if ( resourceId ) {
        const index = _.findIndex( $scope.data, {"id": resourceId} );

        $scope.model = $scope.data[ index ];
    }
    $scope.memberDetails = [];
		// mapping memberID to name, position and display information
    _.each( $scope.data, ( element ) => {
        Restangular.one( `people/${element.relationships.member.data.id}` )
			.get()
			.then( ( person ) => {
    Restangular.one( `positions/${element.relationships.position.data.id}` )
				.get()
				.then( ( position ) => {
    $scope.memberDetails.push( {
        "id": element.id,
        "display": `${person.attributes.name} | ${preProcess.positionToString( teamsIdToName, position, true )}`,
        "name": person.attributes.name,
        "team": preProcess.positionToString( teamsIdToName, position, false ),
        "position": preProcess.positionToString( teamsIdToName, position, true ),
        "isActive": element.attributes.isActive,
        "isLead": position.attributes.isLead,
        "startDate": element.attributes.startDate,
        "endDate": element.attributes.endDate
    } );
} );
} );
    } );
} );

    $scope.updateSelection = function( newModelId ) {
        const index =	_.findIndex( $scope.memberDetails, {"id": newModelId} );

        $scope.model = $scope.memberDetails[ index ];
        $state.transitionTo( "list",
			{"id": newModelId, "resourceName": resourceName},
			{"notify": false}
		);
    };

    $scope.deleteResource = function( id ) {
        dataTransformer.deleteResource( $scope.resourceName, id ).then( () => {
            alert( "Successfully deleted this entry" );
			// $scope.data = Restangular.all($scope.resourceName).getList().$object;
            $scope.model = {};
            $state.transitionTo( "list",
				{"resourceName": $scope.resourceName},
                {
                    "inherit": false,
                    "notify": false,
                    "reload": true
                }
			);
        } );
    };
} );
