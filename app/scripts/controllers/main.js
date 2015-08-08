'use strict';

/**
 * @ngdoc function
 * @name goesToApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the goesToApp
 */
angular.module('goesToApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
