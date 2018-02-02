"use strict";

angular
  .module("app.controllers")
  .controller("MainCtrl", function($scope, apiDescriptor) {
    apiDescriptor.then(function(apiDescription) {
      $scope.apidesc = apiDescription.data;
      
      $scope.links = {
        '✨ Public site': 'http://techatnyu.org',
        'Public site (Staging)': 'http://intranet-staging.tnyu.org/#/',
        'Intranet (Staging)': 'http://intranet-staging.tnyu.org/#/',
        '📆 Calendar': 'http://cal.techatnyu.org',
        'Calendar (Staging)': 'http://cal.techatnyu.org',
        '🙋🏻 RSVP': 'http://rsvp.techatnyu.org',
        'RSVP (Staging)': 'http://rsvp-staging.techatnyu.org'
      }
    });
  });