"use strict";

angular
.module( "app.controllers" )
.controller( "MembershipEditCtrl", ( $scope, $rootScope, $stateParams, $state,
		$interval, formatTeamDisplayFilter, Restangular, apiDescriptor, formElementProvider, dataTransformer ) => {
    const resourceName = $stateParams.resourceName;
    const resourceId = $stateParams.id;

    const resource = Restangular.one( resourceName, resourceId );

    $scope.fep = formElementProvider;

    $scope.data = {};
    resource.get().then( ( data ) => {
        apiDescriptor.then( ( apiDescription ) => {
            $scope.rdesc = apiDescription.resource( resourceName );
            $scope.data = dataTransformer.loadLinkedData( $scope.rdesc, $scope.refreshData );
        } );
        $scope.model = dataTransformer.delink( data );
    } );

    const teamsIdToName = {};

    $scope.positionIdToName = {};
	// mapping teamID to teamName
    Restangular.one( "teams" )
	.getList()
	.then( ( teams ) => {
    _.each( teams, ( element ) => {
        teamsIdToName[ element.id ] = element.attributes.name;
    } );

		// mapping positionID to names
    Restangular.one( "positions" )
		.getList()
		.then( ( position ) => {
    _.each( position, ( element ) => {
        const isLead = element.attributes.isLead;
        const teamName = teamsIdToName[ element.relationships.team.data.id ];

        $scope.positionIdToName[ element.id ] = formatTeamDisplayFilter( teamName, isLead );
        $scope.refreshData( $scope.data, $scope.rdesc.attributes.fields[ 1 ].kind[ "target-type" ] );
    } );
} );
} );

    $scope.updateResource = function( model, rdesc ) {
        dataTransformer.updateResource( model, rdesc, resource ).then( ( data ) => {
            $state.go( "list", { "resourceName": resourceName, "selectionMode": "single", "id": data.id } );
        } );
    };

    $scope.refreshData = function( data, fieldResourceType ) {
        data[ fieldResourceType ] = Restangular.all( fieldResourceType ).getList().$object;
    };
} );
