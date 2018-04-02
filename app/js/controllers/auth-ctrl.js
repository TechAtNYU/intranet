'use strict';

angular
  .module('app.controllers')
  .controller('AuthCtrl', function($scope, $location, Restangular) {
    Restangular.one('people/me')
      .get()
      .then(function(data) {
        $scope.user = data;
      })
      .catch(function(res) {
        const status = res.data.errors[0].status;
        if (status === '401') {
          $scope.signIn();
        }
      });

    $scope.signIn = function() {
      const url =
        'https://api.tnyu.org/v2/auth/facebook?success=' +
        window.encodeURIComponent($location.absUrl());
      window.location = url;
    };

    $scope.signOut = function() {
      const url =
        'https://api.tnyu.org/v2/auth/facebook/logout?doExternalServiceLogout=true&success=' +
        window.encodeURIComponent('http://google.com/');
      window.location = url;
    };
  });
