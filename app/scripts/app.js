'use strict';

/**
 * @ngdoc overview
 * @name goesToApp
 * @description
 * # goesToApp
 *
 * Main module of the application.
 */
angular
  .module('goesToApp', [
    'ngCookies',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
