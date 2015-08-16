'use strict';

/**
 * @ngdoc overview
 * @name tmpApp
 * @description
 * # tmpApp
 *
 * Main module of the application.
 */
angular
  .module('goesTo', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    // PUBLIC Routes
    $routeProvider
      .when('/', {
        templateUrl: '/public/views/homeView.jade',
        controller: 'HomecontrollerCtrl'
      })
      //DEFAULT
      .otherwise({
        redirectTo: '/Error/NotFound'
      });
  });