angular.module('mainController',['authServices','postingAdServices'])

.controller('mainCtrl',function(Auth, $timeout, $location, $rootScope, $http, Item){
  var app=this;
  app.loadme=false;

  $rootScope.$on('$routeChangeStart', function(){
    if(Auth.isLoggedIn()){
      console.log('Success User is Logged in');
      app.isLoggedIn=true;
      Auth.getUser().then(function(data){
        console.log(data.data.phone);
        app.email = data.data.email;
        app.phone = data.data.phone;
        app.loadme=true;
      });
    }
    else{
      console.log('User is not Logged in');
      app.email=null;
      app.isLoggedIn=false;
      app.loadme=true;
    }


  });


    this.doLogin=function(loginData){
      app.loading=true;
      app.errMsg=false;
      Auth.login(app.loginData).then(function(data){
        console.log(data.data.success);
        console.log(data.data.message);
        if(data.data.success){
          //create success message
          app.loading=false;
            app.successMsg=data.data.message + '...Redirecting';
          //redirect to home pages
          $timeout(function(){
              $location.path('/about');
              app.loginData= "";
              app.successMsg=false;
          },2000);


        }
        else{
          //create error message
          app.loading=false;
          app.errMsg=data.data.message;

        }
      });
    };
this.logout = function(){

Auth.logout();
$location.path('/logout');
$timeout(function () {
  $location.path('/');
}, 2000);
};

this.post_ad = function(adData){
      app.adData.email = app.email;
      app.adData.phone = app.phone;
      Item.create(app.adData).then(function(data){
        console.log(data.data.success);
        console.log(data.data.message);
        if(data.data.success){
          //create success message
          app.loading=false;
            app.successMsg=data.data.message + '...Redirecting';
          //redirect to home pages
          $timeout(function(){
              $location.path('/');
          },2000);


        }
        else{
          //create error message
          app.loading=false;
          app.errMsg=data.data.message;

        }
      });

};



});
