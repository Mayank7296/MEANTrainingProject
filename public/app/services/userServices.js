angular.module('userServices',[])
.factory('User',function($http){
  userFactory={};

  userFactory.create = function(regData){
//    User.create(regData);
    return $http.post('/api/users', regData);
  };


  userFactory.renewSession = function(phone){
    return $http.get('/api/renewToken/' + phone);
  };


  return userFactory;
});
