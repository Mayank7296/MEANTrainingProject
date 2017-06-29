angular.module('userServices',[])
.factory('User',function($http){
  userFactory={};

  userFactory.create = function(regData){
//    User.create(regData);
    return $http.post('/api/users', regData);
  }

  return userFactory;
});
