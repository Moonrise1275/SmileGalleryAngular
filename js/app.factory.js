angular.module('app.factory', ['firebase', 'ngImgur'])

.factory('sgAuth', function(firebase, $firebase, $firebaseAuth) {
        var agent = $firebaseAuth(firebase);
        var listeners = [];
        return {
            watch : function(listener) {
                if (typeof listener === 'function') listeners.push(listener);
            },
            register : function(email, password) {
                var self = this;
                agent.$createUser({
                    email : email,
                    password : password
                }).then(function(userData) {
                    firebase.child('user').child(userData.uid).set({
                        nick : email,
                        image : 'http://smig.azurewebsites.net/ArtWork/Image/1249?size=300',
                        profile : '한줄 소개가 없습니다.'
                    });
                    self.authEmail(email, password);
                }).catch(function(err) {
                    alert('인증 실패 : ' + err);
                });
            },
            authEmail : function(email, password) {
                var self = this;
                agent.$authWithPassword({
                    email : email,
                    password : password
                }).then(function(authData) {
                    self.auth = $firebase(firebase.child('user').child(authData.uid)).$asObject();
                    self.auth.$loaded().then(function(auth) {
                        if (!auth.nick) {
                            firebase.child('user').child(authData.uid).set({
                                nick : authData.password ? authData.password.email : 'John',
                                image : 'http://smig.azurewebsites.net/ArtWork/Image/1249?size=300',
                                profile : '한줄 소개가 없습니다.'
                            });
                        }
                    });
                    console.log(self.auth);
                    listeners.forEach(function(each) {
                        each(self.auth);
                    });
                }).catch(function(err) {
                    alert('인증 실패 : ' + err);
                });
            },
            authTwitter : function() {
                var self = this;
                agent.$authWithOAuthPopup('twitter').then(function(authData) {
                    self.auth = $firebase(firebase.child('user').child(authData.uid)).$asObject();
                    self.auth.$loaded().then(function(auth) {
                        if (!auth.nick) {
                            firebase.child('user').child(authData.uid).set({
                                nick : authData.twitter ? authData.twitter.displayName : 'John',
                                image : 'http://smig.azurewebsites.net/ArtWork/Image/1249?size=300',
                                profile : '한줄 소개가 없습니다.'
                            });
                        }
                    });
                    listeners.forEach(function(each) {
                        each(self.auth);
                    });
                }).catch(function(err) {
                    alert('인증 실패 : ' + err);
                    console.log(err);
                });
            },
            authFacebook : function() {
                var self = this;
                agent.$authWithOAuthPopup('facebook').then(function(authData) {
                    self.auth = $firebase(firebase.child('user').child(authData.uid)).$asObject();
                    self.auth.$loaded().then(function(auth) {
                        if (!auth.nick) {
                            firebase.child('user').child(authData.uid).set({
                                nick : authData.facebook ? authData.facebook.displayName : 'John',
                                image : 'http://smig.azurewebsites.net/ArtWork/Image/1249?size=300',
                                profile : '한줄 소개가 없습니다.'
                            });
                        }
                    });
                    listeners.forEach(function(each) {
                        each(self.auth);
                    });
                }).catch(function(err) {
                    alert('인증 실패 : ' + err);
                });
            },
            unAuth : function() {
                agent.$unauth();
                this.auth = null;
                listeners.forEach(function(each) {
                    each(null);
                });
            }
        }
    })

.factory('sgUpload', function(imgur) {
        imgur.setAPIKey('Client-ID 77ced1743b47ed0');
        return function(file, callback) {
            callback = callback || function(){};
            imgur.upload(file).then(function(model) {
                callback(model.link);
            });
        }
    })