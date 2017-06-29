angular.module('userApp',['appRoutes','userControllers','userServices','ngAnimate','mainController','authServices','postingAdServices'])
.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
});
