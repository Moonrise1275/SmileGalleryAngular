angular.module('app.directive', ['app.factory'])

.directive('sgAuthChecker', function(sgAuth) {
        return {
            link : function(scope, element, attributes) {
                sgAuth.watch(function(auth) {scope.auth = auth});
                scope.authFacebook = function() {
                    sgAuth.authFacebook();
                }
                scope.authTwitter = function() {
                    sgAuth.authTwitter();
                }
                scope.unAuth = function() {
                    sgAuth.unAuth();
                }
            }
        }
    })

.directive('sgFileChange', function() {
        return {
            link : function(scope, element, attributes) {
                var handler = scope[attributes.sgFileChange];
                element.bind('change', function() {
                    handler(element[0].files[0]);
                });
            }
        }
    })

.directive('sgImport', function($http, $compile) {
        return {
            link : function(scope, element, attributes) {
                $http.get('/template/' + attributes.sgImport).success(function(data) {
                    element.append($compile(data || 'error!')(scope));
                });
            }
        }
    })