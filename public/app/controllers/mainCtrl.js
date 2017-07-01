angular.module('mainController',['authServices','postingAdServices','userServices','fileModelDirctive'])

.controller('mainCtrl',function(Auth, $timeout, $location, $rootScope, $http, Item, $interval, $window, $route, User, AuthToken){
  var app=this;
  app.loadme=false;

  app.checkSession = function(){
    if(Auth.isLoggedIn()){
      app.checkingSession= true;
      var interval = $interval(function(){
        var token = $window.localStorage.getItem('token');
        if(token  === null){
          $interval.cancel(interval);
        }else{
          self.parseJwt = function(token){
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-','+').replace('_','/');
            return JSON.parse($window.atob(base64));
          }
          var expireTime = self.parseJwt(token);
          var timeStamp = Math.floor(Date.now() / 1000);
          var timeCheck = expireTime.exp - timeStamp;
          console.log(timeCheck);
          if(timeCheck <= 25){
            showModal(1);
            $interval.cancel(interval);
          }
        }
      }, 2000);
    }
  };

  var showModal = function(option){
    app.choiceMade = false;
    app.modelHeader = undefined;
    app.modelBody = undefined;
    app.hideButton = false;



    if(option === 1){
      app.modelHeader = 'Warning: Session About to Expired!!!';
      app.modelBody = 'Your Session is about to expire in 1 min Do you want to Re-Loign?';
      $("#myModal").modal({backdrop: "static"});
    }else if (option === 2) {
      app.hideButton = true;
      app.modelHeader = 'Logging Out';
      $("#myModal").modal({backdrop: "static"});
      $timeout(function () {
        if(!app.choiceMade){
          Auth.logout();
          $location.path('/login');
          $route.reload();
          hideModal();
        }
      }, 3000);

    }
    $timeout(function () {
      if(!app.choiceMade){
        app.hideButton = true;
        app.modelHeader = 'Logging Out';
        $("#myModal").modal({backdrop: "static"});
        $timeout(function () {
          if(!app.choiceMade){
            Auth.logout();
            $location.path('/login');
            $route.reload();
            hideModal();
          }
        }, 3000);
      }
    }, 5000);

  };

  app.renewSession = function(){
    app.choiceMade = true;
    User.renewSession(app.phone).then(function(data){
      if(data.data.success){
        AuthToken.setToken(data.data.token);
        app.checkSession();
      }else{
        app.modelBody = data.data.message;
      }
    });
    hideModal();
  };



  app.endSession = function(){
    app.choiceMade = true;
    hideModal();
    $timeout(function () {
      showModal(2);
    }, 1000);
  };

  var hideModal = function(){
    $("#myModal").modal('hide');
  };

//Creating for session transfer from one page to another page
  $rootScope.$on('$routeChangeStart', function(){

    if(!app.checkingSession) app.checkSession(); //Checking for new pages

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

//login function
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
              app.checkSession();
          },2000);
        }
        else{
          //create error message
          app.loading=false;
          app.errMsg=data.data.message;
        }
      });
    };


    // $timeout(function () {
    //   $location.path('/');
    // }, 2000);

 //logout function that calls the modal for logging out
app.logout = function(){
  showModal(2);
};


//Posting add function to add advertisements in the database
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

function getItem(){
  Item.getItems().then(function(data){
    if(data.data.success){
      console.log(data.data.item);
      app.item = data.data.item;

      app.loading = false;
    } else{
      app.errorMsg = data.data.message;
      app.loading = false;
    }
  });

}

getItem();

Item.showItems().then(function(data){
  if(data.data.success){
    console.log(data.data.items);
    app.items = data.data.items;
    app.loading = false;
  } else{
    app.errorMsg = data.data.message;
    app.loading = false;
  }
});

app.deleteItem = function(_id){
  Item.deleteItem(_id).then(function(data){
    if(data.data.success){
      getItem();
    }else{
      app.errorMsg = data.data.message;
    }
  });
};


})

.controller('editCtrl', function($scope, $routeParams, Item, $timeout){
  var app = this;
  $scope.titleTab = 'active';
  app.phase1 = true;
  Item.getItem($routeParams.id).then(function(data) {
     if(data.data.success){
       $scope.newTitle = data.data.item.title;
       $scope.newDescription = data.data.item.description;
       $scope.newPrice = data.data.item.price;
       $scope.newValid = data.data.item.valid;
       $scope.newImage = data.data.item.img;
       app.id = data.data.item._id;
     }else{
       app.errorMsg = data.data.message;
     }
  });


  app.titlePhase = function(){
    $scope.titleTab = 'active';
    $scope.descriptionTab = 'default';
    $scope.priceTab = 'default';
    $scope.imageTab = 'default';
    $scope.validTab = 'default';
    app.phase1 = true;
    app.phase2 = false;
    app.phase3 = false;
    app.phase4 = false;
    app.phase5 = false;
    app.errorMsg = false;
  }
  app.descriptionPhase = function(){
    $scope.titleTab = 'default';
    $scope.descriptionTab = 'active';
    $scope.priceTab = 'default';
    $scope.imageTab = 'default';
    $scope.validTab = 'default';
    app.phase1 = false;
    app.phase2 = true;
    app.phase3 = false;
    app.phase4 = false;
    app.phase5 = false;
    app.errorMsg = false;
  };
  app.pricePhase = function(){
    $scope.titleTab = 'default';
    $scope.descriptionTab = 'default';
    $scope.priceTab = 'active';
    $scope.imageTab = 'default';
    $scope.validTab = 'default';
    app.phase1 = false;
    app.phase2 = false;
    app.phase3 = true;
    app.phase4 = false;
    app.errorMsg = false;
    app.phase5 = false;
  };
  app.imagePhase = function(){
    $scope.titleTab = 'default';
    $scope.descriptionTab = 'default';
    $scope.priceTab = 'default';
    $scope.imageTab = 'active';
    $scope.validTab = 'default';
    app.phase1 = false;
    app.phase2 = false;
    app.phase3 = false;
    app.phase4 = true;
    app.phase5 = false;
    app.errorMsg = false;
  };
  app.validPhase = function(){
    $scope.titleTab = 'default';
    $scope.descriptionTab = 'default';
    $scope.priceTab = 'default';
    $scope.imageTab = 'default';
    $scope.validTab = 'active';
    app.phase1 = false;
    app.phase2 = false;
    app.phase3 = false;
    app.phase4 = false;
    app.phase5 = true;
    app.errorMsg = false;
  };


  app.updateTitle = function(newTitle, valid) {
    app.errorMsg = false;
    app.disable = true;
    var itemObject = {};
    console.log(app.id + "::::" + $scope.newTitle);

    if(valid){
      itemObject._id = app.id;
      itemObject.title = $scope.newTitle;
      console.log(itemObject._id);
      Item.editItem(itemObject).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          $timeout(function(){
            app.successMsg = false;
            app.disable = false;
            app.titleForm.title.$setPristine();
            app.titleForm.title.$setUntouched();
          }, 2000);
        } else{
            app.errorMsg = data.data.message;
            app.disable  = false;
          }
      });
    } else{
      app.errorMsg = 'please enter a proper title';
      app.disable  = false;
    }
  };

  app.updateDescription = function(newDescription, valid) {
    app.errorMsg = false;
    app.disable = true;
    var itemObject = {};
  //  console.log(app.id + "::::" + $scope.newDescription);

    if(valid){
      itemObject._id = app.id;
      itemObject.description = $scope.newDescription;
      //console.log($scope.newDescription);
      Item.editItem(itemObject).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          app.successMsg = false;
          app.disable = false;
          $timeout(function(){
            app.successMsg = false;
            app.disable = false;
            app.descriptionForm.description.$setPristine();
            app.descriptionForm.description.$setUntouched();
          }, 2000);
        } else{
            app.errorMsg = data.data.message;
            app.disable  = false;
          }
      });
    } else{
      app.errorMsg = 'please enter a proper title';
      app.disable  = false;
    }
  };

  app.updatePrice = function(newPrice, valid) {
    app.errorMsg = false;
    app.disable = true;
    var itemObject = {};
  //  console.log(app.id + "::::" + $scope.newDescription);

    if(valid){
      itemObject._id = app.id;
      itemObject.price = $scope.newPrice;
      //console.log($scope.newDescription);
      Item.editItem(itemObject).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          app.successMsg = false;
          app.disable = false;
          $timeout(function(){
            app.successMsg = false;
            app.disable = false;
            app.priceForm.price.$setPristine();
            app.priceForm.price.$setUntouched();
          }, 2000);
        } else{
            app.errorMsg = data.data.message;
            app.disable  = false;
          }
      });
    } else{
      app.errorMsg = 'please enter a proper Price';
      app.disable  = false;
    }
  };

  app.updateValid = function(newValid, valid) {
    app.errorMsg = false;
    app.disable = true;
    var itemObject = {};
  //  console.log(app.id + "::::" + $scope.newDescription);
  console.log(valid);
    if(valid){
      itemObject._id = app.id;
      itemObject.valid = $scope.newValid;
      Item.editItem(itemObject).then(function(data){
        if(data.data.success){
          app.successMsg = data.data.message;
          app.successMsg = false;
          app.disable = false;
          $timeout(function(){
            app.successMsg = false;
            app.disable = false;
            app.validForm.valid.$setPristine();
            app.validForm.valid.$setUntouched();
          }, 2000);
        } else{
            app.errorMsg = data.data.message;
            app.disable  = false;
          }
      });
    } else{
        app.errorMsg = 'please enter either Enable or Disable';
        app.disable  = false;
    }
  };


});
