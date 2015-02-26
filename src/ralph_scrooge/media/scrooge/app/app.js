'use strict';

var app = angular.module('app', [
    'ngRoute',
    'ngCookies',
    'ngAnimate',
    'ngScrollbar',
    'angular-loading-bar',

    'scrooge.controller',
    'scrooge.controller.menu',
    'scrooge.controller.component',
    'scrooge.controller.costcard',
    'scrooge.controller.allocationclient',
    'scrooge.controller.allocationadmin',
    'scrooge.controller.costs_per_device',
    'scrooge.directive',
    'scrooge.directive.menu',
    'scrooge.service',
    'scrooge.service.menu',
    'scrooge.filter',
    'scrooge.filter.menu',
]);

app.config(['$routeProvider', '$httpProvider', 'STATIC_URL',
    function($routeProvider, $httpProvider, STATIC_URL) {
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
                templateUrl: STATIC_URL + 'scrooge/partials/components.html',
                controller: 'componentsCtrl',
            })
            .when('/allocation/client/', {
                templateUrl: STATIC_URL + 'scrooge/partials/allocationclient.html',
                controller: 'allocationClientCtrl',
            })
            .when('/allocation/admin/', {
                templateUrl: STATIC_URL + 'scrooge/partials/allocationadmin.html',
                controller: 'allocationAdminCtrl',
            })
            .when('/costcard/', {
                templateUrl: STATIC_URL + 'scrooge/partials/costcard.html',
                controller: 'costCardCtrl',
            })
            .when('/costs-per-device/', {
                templateUrl: STATIC_URL + 'scrooge/partials/costs_per_device.html',
                controller: 'costPerDeviceCtrl',
            })
            .otherwise({redirectTo: '/components/'});
    }
]);

app.run(function($http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;

    // $http.get('/api/current_user/').success(function (data) {
    //     $rootScope.$broadcast('event:user-loggedIn', data);
    // });
});

app.constant('STATIC_URL', '/static/');
