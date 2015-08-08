'use strict';

/**
 * @ngdoc function
 * @name goesToApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the goesToApp
 */
angular.module('goesToApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
