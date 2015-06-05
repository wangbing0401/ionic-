var app = angular.module('myapp', ['ionic']);

app.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.tabs.style("standard");

    $stateProvider
        .state('tabs', {
            url: "/tab",
            templateUrl: "templates/tabs.html"
        })
        .state('tabs.home', {
            url: "/home",
            views: {
                'home-tab': {
                    templateUrl: "templates/home.html",
                    controller: "HomeTabController"
                }
            }
        })
        .state('tabs.push', {
            url: "/push",
            views: {
                'home-tab': {
                    templateUrl: "templates/push.html",
                    controller: "PushController"
                }
            }
        })
        .state('tabs.detail', {
            url: "/detail",
            views: {
                'detail-tab': {
                    templateUrl: "templates/detail.html",
                    controller: "DetailTabController"
                }
            }
        })
        .state('tabs.setting', {
            url: "/setting",
            views: {
                'setting-tab': {
                    templateUrl: "templates/setting.html",
                    controller: "SettingTabController"
                }
            }
        })
    $urlRouterProvider.otherwise('/tab/home')
}]);
app.controller('HomeTabController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){
    $scope.$on('$ionicView.enter', function(){
        $rootScope.hideTabs = false;
    });
    $scope.push = function(){
        $rootScope.hideTabs = true;
        $state.go('tabs.push');
    }
}]);
app.controller('PushController', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.fanhui = function(){
        $rootScope.hideTabs = false;
        window.history.back();
    }
}]);
app.controller('DetailTabController', ['$scope', function($scope){
    var socket = io('http://192.168.1.113:3000');
    $scope.$on('$ionicView.enter', function(){
        socket.on('connect', function(){
            console.log('Client has connected to the server!');
        });
    });
    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    $scope.$on('$ionicView.leave', function(){
        socket.on('disconnect', function(){
            console.log('Client has disconnect to the server!')
        });
    });
}]);

app.controller('SettingTabController', ['$scope', function($scope){
}]);

app.controller('sideMenuController', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

}]);