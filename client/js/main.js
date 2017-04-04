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
    
angularRoutingApp.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
    
angularRoutingApp.controller('mainController', function($scope, $http, $cookieStore, $rootScope) {
    $scope.message = 'Hola, Mundo!';
    $http.get('/traders').then(function(response){
        $scope.traders = response.data;
    });
    $scope.logout = function(){
        $cookieStore.remove('token');
        $cookieStore.remove('username');
        $rootScope.globalToken = "";
        $rootScope.globalUsername = "";
    };
});

angularRoutingApp.controller('signupController', function($scope, $http, $location) {
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
           $location.path('/login');
        });
    }
});

angularRoutingApp.controller('loginController', function($scope, $rootScope, $http, $cookies, $location) {
    $scope.message = 'Esta es la página login';
    $scope.signin = function(){
        $http.put('/users/signin',{username: $scope.username, password: $scope.password})
        .then(function(res){
            console.log(res.data.token);
            $rootScope.globalUsername = $scope.username;
            $rootScope.globalToken = res.data.token;
            $cookies.username = $scope.username;
            $cookies.token = res.data.token;
            alert("Bienvenido de nuevo "+$scope.username+".");
            $location.path('/senales');
        },function(err){
            alert("Lo sentimos. Tu usuario o contraseña es incorrecto.");
            $location.path('/login');
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
  $scope.player = $sce.trustAsHtml('<iframe id="tradingview_41027"ng-show="selected_stock"src="https://s.tradingview.com/widgetembed/?symbol=EURUSD&interval=1&hidesidetoolbar=0&symboledit=1&saveimage=0&toolbarbg=f1f3f6&studies=ROC%40tv-basicstudies%1FStochasticRSI%40tv-basicstudies%1FMASimple%40tv-basicstudies&hideideas=1&theme=White&style=1&timezone=exchange&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&showpopupbutton=1&referral_id=1417&utm_medium=widget&utm_campaign=chart&utm_term=EURUSD" width="100%" height="450" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
});
//Solucion meter iframes http://plnkr.co/edit/Md5QC4?p=preview
/*<iframe-directive></iframe-directive>
angularRoutingApp.directive('iframeDirective', ['$sce', function($sce) {
  return {
    restrict: 'E',
    template: '<iframe src="{{ trustedUrl }}" style="width:350px; height:300px" frameborder="0" scrolling="no"><p>Tu navegador no soporta iframe.</p></iframe>',
    link: function(scope) {
      scope.trustedUrl = $sce.trustAsResourceUrl("//fxlabs.iitech.dk/Widgets/Chart/Chart.aspx?instanceId=27354");
    }
  }
}]);
*/