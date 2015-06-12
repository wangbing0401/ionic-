var app = angular.module('myapp', ['ionic', 'ngCordova']);

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
        .state('tabs.scroll', {
            url:"/scroll",
            views:{
                'home-tab':{
                    templateUrl:"templates/scroll.html",
                    controller:"ScrollController"
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
    $scope.push_scroll = function(){
        $rootScope.hideTabs = true;
        $state.go('tabs.scroll');
    }
}]);
app.controller('PushController', ['$scope', '$rootScope', '$cordovaActionSheet', '$cordovaCamera', '$cordovaBarcodeScanner', function($scope, $rootScope, $cordovaActionSheet, $cordovaCamera, $cordovaBarcodeScanner){
    var sheet_options = {
        buttonLabels: ['相机', '相册'],
        addCancelButtonWithLabel: '取消',
        androidEnableCancelButton : true,
        winphoneEnableCancelButton : true,
    };

    var camera_options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
    };

    var photo_options = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
    };

    document.addEventListener("deviceready", function () {
        $scope.sheetShow = function(){
            $cordovaActionSheet.show(sheet_options).then(function(btnIndex){
                if(btnIndex == 1){
                    $cordovaCamera.getPicture(camera_options).then(function(imageData){
                        alert(imageData);
                    });
                }
                if(btnIndex == 2){
                    $cordovaCamera.getPicture(photo_options).then(function(imageUrI){
                        alert(imageUrI);
                    });
                }
            });
        }
        $scope.tiaoxingma = function(){
            $cordovaBarcodeScanner.scan().then(function(barcodeData){
                alert(barcodeData.lastName);
            }, function(error){

            });
        }
    }, false);
    $scope.fanhui = function(){
        $rootScope.hideTabs = false;
        window.history.back();
    }
}]);
app.controller('ScrollController', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.fanhui = function(){
        $rootScope.hideTabs = false;
        window.history.back();
    }
    $scope.doRefresh = function() {

        console.log('Refreshing!');
        $timeout( function() {


            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };
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

app.controller('SettingTabController', ['$scope', '$cordovaCapture', '$cordovaTouchID', function($scope, $cordovaCapture, $cordovaTouchID){
    document.addEventListener("deviceready", function () {
        $cordovaTouchID.checkSupport().then(function(){
            $cordovaTouchID.authenticate("确认支付吗").then(function() {
                alert("成功");
            }, function () {
                alert("失败");
            });
        }, function(error){
            alert("失败啦");
        });

        $scope.captureVideo = function() {
            var options = { limit: 3, duration: 15 };

            $cordovaCapture.captureVideo(options).then(function(videoData) {
                $("#wb_video").attr('src', videoData);
                $("#wb_video").attr('autoplay', 'true');
            }, function(err) {
                // An error occurred. Show a message to the user
            });
        }
    }, false);

}]);

app.controller('sideMenuController', ['$scope', '$rootScope', function($scope, $rootScope){
    $scope.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

}]);