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
function dialog_show(dia_content) {
    var d = dialog({
        content: dia_content
    });
    d.show();
    setTimeout(function() {
        d.close().remove();
    }, 1500);
}
app.factory('service', function(){
    return {};
});
app.controller('HomeTabController', ['$scope', '$rootScope', '$state', '$ionicSideMenuDelegate', function($scope, $rootScope, $state, $ionicSideMenuDelegate){
    $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(true);
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
app.controller('ScrollController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
    $scope.fanhui = function(){
        $rootScope.hideTabs = false;
        window.history.back();
    }
    $scope.data = [1,2,3,4,5];
    var length;
    $scope.doRefresh = function() {
        length = $scope.data.length;
        length++;
        $scope.data.push(length);
        $timeout( function() {
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');

        }, 1000);

    };
}]);
app.controller('DetailTabController', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate){
    var socket = io('http://10.10.10.127:3000');
    $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(false);
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

app.controller('SettingTabController', ['$scope', '$cordovaCapture', '$cordovaTouchID', '$ionicSideMenuDelegate', '$cordovaDevice', function($scope, $cordovaCapture, $cordovaTouchID, $ionicSideMenuDelegate, $cordovaDevice){
    $scope.$on('$ionicView.enter', function(){
        $ionicSideMenuDelegate.canDragContent(false);
    });
    if($cordovaDevice.getPlatform() == "iOS"){
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
        }, false);
    }
    $scope.captureVideo = function() {
        var options = { limit: 3, duration: 15 };

        $cordovaCapture.captureVideo(options).then(function(videoData) {
            $("#wb_video").attr('src', videoData);
            $("#wb_video").attr('autoplay', 'true');
        }, function(err) {
            // An error occurred. Show a message to the user
        });
    }
}]);

app.controller('sideMenuController', ['$scope', '$rootScope', '$ionicPlatform', function($scope, $rootScope, $ionicPlatform){
    $scope.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    var time = true;
    $ionicPlatform.registerBackButtonAction(function(){
        if(!time){
            ionic.Platform.exitApp();
        }else{
            dialog_show("再次点击退出");
            time = false;
            setTimeout(function(){
                time = true;
            }, 1500);
        }
    }, 100);
}]);

//var time = true;
//plus.key.addEventListener("backButton", function(){
//    if(!time){
//        ionic.Platform.exitApp();
//    }else{
//        time = false;
//        setTimeout(function(){
//            time = true;
//        }, 1500);
//    }
//});