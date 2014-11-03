'use strict';

var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'ngScrollbar',
    'angular-loading-bar',

    'scrooge.directives',
    'scrooge.controllers',
    'ang_controllers',
    'ang_directives',
    'ang_services',
    'ang_filters',
]);

app.config(['$routeProvider', '$httpProvider',
    function($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push(function ($q) {
            return {
                responseError: function (rejection) {
                    // if the backend returns 401/403 it means that we should log in first
                    if (rejection.status === 401 || rejection.status === 403) {
                        window.location.replace('/login/');
                    }
                    return $q.reject(rejection);
                }
            };
        });
        $routeProvider
            .when('/components/', {
                templateUrl: '/static/scrooge/partials/components.html',
                controller: 'componentsCtrl',
            })
            .when('/allocation/client/', {
                templateUrl: '/static/scrooge/partials/allocationclient.html',
                controller: 'allocationClientCtrl',
            })
            .otherwise({redirectTo: '/components/'});
    }
]);
