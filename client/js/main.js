// Creación del módulo
var angularRoutingApp = angular.module('angularRoutingApp', ['ngRoute', 'ngCookies']);

// Configuración de las rutas
angularRoutingApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'pages/trader.html',
            controller  : 'mainController'
        })
        .when('/signup', {
            templateUrl : 'pages/signup.html',
            controller  : 'signupController'
        })
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController'
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

angularRoutingApp.run(function($rootScope, $cookies){
        if($cookies.token && $cookies.username){
            $rootScope.globalUsername = $cookies.username;
            $rootScope.globalToken = $cookies.token;
        }
    });

angularRoutingApp.controller('mainController', function($scope, $http) {
    $scope.message = 'Hola, Mundo!';
    $http.get('/traders').then(function(response){
        $scope.traders = response.data;
    });
});

angularRoutingApp.controller('signupController', function($scope, $http) {
    $scope.message = 'Esta es la página signup';
    
    $scope.submitSignup = function(){
        var newUser = {
            username: $scope.username,
            password: $scope.password,
            email: $scope.email,
            nombre: $scope.nombre,
            apellidos: $scope.apellidos,
            genero: $scope.genero,
            pais: $scope.pais,
            telefono: $scope.telefono,
            f_nacimiento: $scope.f_nacimiento1+"/"+$scope.f_nacimiento2+"/"+$scope.f_nacimiento3,
            saldo: $scope.saldo,
            apalancamiento: $scope.apalancamiento,
            divisa: $scope.divisa,
            genero: $scope.genero
        };
        $http.post('https://nodeguardianapp-josmaxwell.c9users.io/users', newUser).then(function() {
           alert('Registrado!') 
        });
    }
});

angularRoutingApp.controller('loginController', function($scope, $rootScope, $http, $cookies) {
    $scope.message = 'Esta es la página login';
    $scope.signin = function(){
        $http.put('/users/signin',{username: $scope.username, password: $scope.password})
        .then(function(res){
            console.log(res.data.token);
            $rootScope.globalUsername = $scope.username;
            $rootScope.globalToken = res.data.token;
            $cookies.username = $scope.username;
            $cookies.token = res.data.token;
            alert("Login Succesfull");
        },function(err){
            alert("Login Failed");
        });
        
    }
});

angularRoutingApp.controller('customersCtrl', function($scope) {
    $scope.names = [
        {name:'Jani',country:'Norway'},
        {name:'Carl',country:'Sweden'},
        {name:'Margareth',country:'England'},
        {name:'Hege',country:'Norway'},
        {name:'Joe',country:'Denmark'},
        {name:'Gustav',country:'Sweden'},
        {name:'Birgit',country:'Denmark'},
        {name:'Mary',country:'England'},
        {name:'Kai',country:'Norway'}
        ];
    $scope.orderByMe = function(x) {
        $scope.myOrderBy = x;
    }

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

angularRoutingApp.controller('tradingViewController', function($scope, $sce) {
    //TUTORIAL METER IFRAME EN ANGULAR:http://plnkr.co/edit/MIj215Ek4IGQog8uP5yq?p=preview
  $scope.player = $sce.trustAsHtml('<iframe id="tradingview_41027"ng-show="selected_stock"src="https://www.tradingview.com/widgetembed/?symbol="NASDAQ:GOOGL"&amp;interval=D&amp;toolbarbg=E4E8EB" width="100%" height="200" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
});

