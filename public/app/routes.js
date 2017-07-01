var app = angular.module('appRoutes',['ngRoute'])

.config(function($routeProvider,$locationProvider) {
  $routeProvider
  .when('/',{
    templateUrl:'app/views/pages/home.html'
  })
  .when('/about',{
    templateUrl:'app/views/pages/about.html'
  })
  .when('/register',{
    templateUrl:'app/views/pages/users/register.html',
    controller: 'regCtrl',
    controllerAs: 'register',
    authenticated: false
  })
  .when('/login',{
    templateUrl:'app/views/pages/users/login.html',
    authenticated: false
    //controller: 'regCtrl',
    //controllerAs: 'register'
  })
  .when('/postadvertisment',{
    templateUrl:'app/views/pages/users/postadver.html',
    authenticated: true
  })
  .when('/logout',{
    templateUrl:'app/views/pages/users/logout.html',
    authenticated: true
    //controller: 'regCtrl',
    //controllerAs: 'register'

  })
  .when('/profile',{
    templateUrl:'app/views/pages/users/profile.html',
    authenticated: true

  })
  .when('/edit/:id', {
    templateUrl: 'app/views/pages/users/edit.html',
    controller: 'editCtrl',
    controllerAs: 'edit',
    authenticated: true
  })
  .when('/facebook/:token',{
    templateUrl:'app/views/pages/users/social/social.html',
    authenticated: false
  })

  .otherwise({redirectTo: '/'});

$locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  //$locationProvider.hashPrefix('');
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if(next.$$route.authenticated == true){
      if(!Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/login');
      }
    }else if (next.$$route.authenticated == false) {

      if(Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/profile');
      }
    }
  });

}]);
