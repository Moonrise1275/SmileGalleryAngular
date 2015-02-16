angular.module('app.controller', ['app.factory', 'firebase'])

.controller('folioListCtrl', function($scope, $location, $firebase, firebase, sgAuth) {
        $scope.folios = $firebase(firebase.child('folio')).$asArray();
        $scope.createFolio = function() {
            if (!sgAuth.auth) return;
            var newFolioId = firebase.child('folio').push({
                name : 'New folio',
                user : sgAuth.auth.$id
            }).key();
            $location.path('/folio/' + newFolioId);
        }
    })

.controller('loginCtrl', function($scope, sgAuth) {
        $scope.title = '로그인';
        $scope.submit = function() {
            sgAuth.authEmail($scope.email, $scope.password);
        }
    })

.controller('registerCtrl', function($scope, sgAuth) {
        $scope.title = '회원가입';
        $scope.submit = function() {
            sgAuth.register($scope.email, $scope.password);
        }
    })

.controller('folioListElemCtrl', function($scope, $firebase, firebase, sgAuth) {
        $firebase(firebase.child('user').child($scope.folio.user)).$asObject().$bindTo($scope, 'artist');
        $scope.pages = $firebase(firebase.child('folio').child($scope.folios.$keyAt($scope.folio)).child('page')).$asArray();
        $scope.hasMe = function(obj) {
            if (!sgAuth.auth ||!obj) return;
            return obj[sgAuth.auth.$id];
        }
        $scope.setLike = function(like) {
            if (!$scope.auth) return;
            var key = $scope.folios.$keyAt($scope.folio);
            var ref = $scope.folios.$inst().$ref().child(key).child('like').child(sgAuth.auth.$id);
            if (like) {
                ref.set(new Date().getTime());
            } else {
                ref.remove();
            }
        }
        $scope.getSize = function(obj) {
            if (!obj) return 0;
            return Object.keys(obj).length;
        }
        $scope.isMine = function() {
            return sgAuth.auth && $scope.folio && $scope.folio.user === sgAuth.auth.$id;
        }
    })

.controller('folioCtrl', function($scope, $routeParams, $firebase, firebase, sgAuth, sgUpload) {
        var folioRef = firebase.child('folio').child($routeParams.folioId);
        $firebase(folioRef).$asObject().$bindTo($scope, 'folio').then(function() {
            $firebase(firebase.child('user').child($scope.folio.user)).$asObject().$bindTo($scope, 'author');
        });
        $scope.pages = $firebase(folioRef.child('page')).$asArray();
        $scope.comments = $firebase(folioRef.child('comment')).$asArray();
        $scope.isMine = function(user) {
            if (!sgAuth.auth || !user) return false;
            return sgAuth.auth.$id === user;
        }
        $scope.hasMe = function(obj) {
            if (!sgAuth.auth || !obj) return false;
            return !!obj[sgAuth.auth.$id]
        }
        $scope.setLike = function(like) {
            if (!sgAuth.auth) return;
            var ref = $scope.folio.$inst().$ref().child('like').child(sgAuth.auth.$id);
            if (like) {
                ref.set(new Date().getTime());
            } else {
                ref.remove();
            }
        }
        $scope.onFile = function(file) {
            sgUpload(file, function(link) {
                $scope.newImage = link;
            })
        }
        $scope.follow = function(flag) {
            if (!sgAuth.auth) return;
            var myRef = sgAuth.auth.$inst().$ref().child('following').child($scope.author.$id);
            var authorRef = firebase.child('user').child($scope.author.$id).child('follower').child(sgAuth.auth.$id);
            if (flag) {
                var time = new Date().getTime();
                myRef.set(time);
                authorRef.set(time)
            } else {
                myRef.remove();
                authorRef.remove();
            }
        }
        $scope.following = function(id) {
            return sgAuth.auth && sgAuth.auth.following && sgAuth.auth.following[id];
        }
        $scope.addComment = function(comment) {
            if (!sgAuth.auth) return;
            $scope.comments.$inst().$push({
                user : sgAuth.auth.$id,
                text : comment
            });
        }
    })

.controller('folioCommentCtrl', function($scope, $firebase, firebase, sgAuth) {
        $firebase(firebase.child('user').child($scope.comment.user)).$asObject().$bindTo($scope, 'user');
        $scope.likes = $firebase($scope.comments.$inst().$ref().child($scope.comments.$keyAt($scope.comment)).child('like')).$asArray();
        $scope.setLike = function(like) {
            if (!sgAuth.auth) return;
            var key = $scope.comments.$keyAt($scope.comment);
            var ref = $scope.comments.$inst().$ref().child(key).child('like').child(sgAuth.auth.$id);
            if (like) {
                ref.set(new Date().getTime());
            } else {
                ref.remove();
            }
        }
    })

.controller('userCtrl', function($scope, $location, $routeParams, $firebase, firebase, sgAuth) {
        var userRef = firebase.child('user').child($routeParams.userId);
        $firebase(userRef).$asObject().$bindTo($scope, 'user');
        $scope.isMe = function() {
            return sgAuth.auth && $scope.user && (sgAuth.auth.$id === $scope.user.$id);
        }
        $scope.followers = $firebase(userRef.child('follower')).$asArray();
        $scope.followings = $firebase(userRef.child('following')).$asArray();
        $scope.follow = function(id) {
            if (!sgAuth.auth) return;
            var time = new Date().getTime();
            sgAuth.auth.$inst().$ref().child('following').child(id).set(time);
            userRef.child('follower').child(sgAuth.auth.$id).set(time);
        }
        $scope.unfollow = function(id) {
            if (!sgAuth.auth) return;
            sgAuth.auth.$inst().$ref().child('following').child(id).remove();
            userRef.child('follower').child(sgAuth.auth.$id).remove();
        }
        $scope.following = function(id) {
            return sgAuth.auth && sgAuth.auth.following && sgAuth.auth.following[id];
        }
        $scope.isMe = function() {
            return sgAuth.auth && (sgAuth.auth.$id === $routeParams.userId);
        }
        $scope.folios = $firebase(firebase.child('folio').orderByChild('user').equalTo($routeParams.userId)).$asArray();
        $scope.createFolio = function() {
            if (!sgAuth.auth) return;
            var newFolioId = firebase.child('folio').push({
                name : 'New folio',
                user : sgAuth.auth.$id
            }).key();
            $location.path('/folio/' + newFolioId);
        }
    })