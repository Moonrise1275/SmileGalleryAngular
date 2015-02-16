angular.module('app', ['app.controller', 'app.directive', 'app.factory', 'ngRoute'])

.config(function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl : '/template/login.html',
                controller : 'loginCtrl'
            })
            .when('/register', {
                templateUrl : '/template/login.html',
                controller : 'registerCtrl'
            })
            .when('/folio', {
                templateUrl : '/template/folioList.html',
                controller : 'folioListCtrl'
            })
            .when('/folio/:folioId', {
                templateUrl : '/template/folio.html',
                controller : 'folioCtrl'
            })
            .when('/user/:userId', {
                templateUrl : '/template/user.html',
                controller : 'userCtrl'
            })
            .otherwise('/folio');
    })

.value('firebase', new Firebase('https://smilegallerytest.firebaseio.com/'))
