var app = angular.module('app', ['ngRoute']);

// Configuración de las rutas
app.config(function($routeProvider) {

    $routeProvider
        .when('/senales', {
            templateUrl : 'pages/operaciones.html',
            controller  : 'mController'
        })
        .when('/misoperaciones', {
            templateUrl : 'pages/misoperacones.html',
            controller  : 'aController'
        })
       
        .otherwise({
            redirectTo: '/'
        });
        
        app.controller('mController', function($scope) {
    $scope.message = 'Hola, Mundo!';
});

app.controller('aController', function($scope) {
    $scope.message = 'Esta es la página "Acerca de"';
});
});