// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute']);

// Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'pages/trader.html',
            controller  : 'mainController'
        })
        .when('/senales', {
            templateUrl : 'pages/senales.html',
            controller  : 'aboutController'
        })
        .when('/contacto', {
            templateUrl : 'pages/contacto.html',
            controller  : 'contactController'
        })
        .when('/perfil', {
            templateUrl : 'pages/perfil.html',
            controller  : 'perfilController'
        })
        .when('/binarias', {
            templateUrl : 'pages/binarias.html',
            controller  : 'binariasController'
        })
        .otherwise({
            redirectTo: '/'
        });
});

angularRoutingApp.controller('mainController', function($scope, $http) {
    $scope.message = 'Hola, Mundo!';
    $http.get('/traders').then(function(response){
        $scope.traders = response.data;
    });
});

angularRoutingApp.controller('TimeCtrl', function($scope, $interval) {
  var tick = function() {
    $scope.clock = Date.now();
  }
  tick();
  $interval(tick, 1000);
});

angularRoutingApp.controller('aboutController', function($scope) {
    $scope.message = 'Esta es la página "senales de"';
});

angularRoutingApp.controller('binariasController', function($scope) {
    $scope.message = 'Esta es la página binarias';
});

angularRoutingApp.controller('perfilController', function($scope) {
    $scope.message = 'Esta es la página perfil';
});

angularRoutingApp.controller('contactController', function($scope) {
    $scope.message = 'Esta es la página de "Contacto", aquí podemos poner un formulario';
});
