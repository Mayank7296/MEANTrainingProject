angular.module('userControllers',['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User){

var app=this;

  this.regUser=function(regData){
    app.loading=true;
    app.errMsg=false;
    User.create(app.regData).then(function(data){
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
