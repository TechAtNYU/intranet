angular
.module( "app.controllers" )
.controller( "PositionListCtrl", ( $scope, $rootScope, $stateParams,
		$state, formatTeamDisplayFilter, Restangular, apiDescriptor, dataTransformer, preProcess ) => {
    const resourceName = $stateParams.resourceName;
    const resourceId = $stateParams.id;

    $scope.resourceName = resourceName;
    apiDescriptor.then( ( apiDescription ) => {
        $scope.rdesc = apiDescription.resource( resourceName );
    } );
	// PositionID -> Team ID -> Team Name
    const teamsIdToName = preProcess.objectIdtoName( "teams" );

    Restangular.all( resourceName )
	.getList()
	.then( ( data ) => {
    $scope.data = data;

    if ( resourceId ) {
        const index = _.findIndex( $scope.data, { "id": resourceId } );

        $scope.model = $scope.data[ index ];
    }

    _.each( $scope.data, ( element ) => {
        element.attributes.responsibilities = element.attributes.responsibilities.length == 0 ? "None" : element.attributes.responsibilities.join( " " );
        element.attributes.name = preProcess.positionToString( teamsIdToName, element, true );
        element.attributes.team = preProcess.positionToString( teamsIdToName, element, false );
        element.attributes.applicationForm = ( element.relationships.applicationForm.data == null ? "None" : element.relationships.applicationForm );
    } );
} );

    $scope.updateSelection = function( resourceId ) {
        const index =	_.findIndex( $scope.data, { "id": resourceId } );

        $scope.model = $scope.data[ index ];
        $state.transitionTo( "list",
			{ "id": resourceId, "resourceName": resourceName },
			{ "notify": false }
		);
    };

    $scope.deleteResource = function( id ) {
        dataTransformer.deleteResource( $scope.resourceName, id ).then( () => {
            alert( "Successfully deleted this entry" );
            $scope.model = {};
            $state.transitionTo( "list",
				{ "resourceName": $scope.resourceName },
                {
                    "inherit": false,
                    "notify": false,
                    "reload": true
                }
			);
        } );
    };
} );
