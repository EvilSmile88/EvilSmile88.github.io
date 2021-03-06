var app = angular.module("App", []);
app.controller("AppCtrl", function ($scope) {
    $scope.place = "Log";
    $scope.nav = [
        {class: "current_nav", url: "img/gallery.png", title: "gallery", alt: "gallery"}
    ]
    $scope.vk = {
        data: {},
        appID: 6085608,
        appPermissions: 5,
        albums_content: [],
        init: function(){
            VK.Auth.login($scope.authInfo, $scope.vk.appPermissions);
        }
    };
    $scope.authInfo = function(response){
        if(response.session){ // Авторизация успешна
            $scope.place = "Loading";
            console.log(response.session)
            $(".nav div:first-of-type").click();
            $scope.vk.data.user = response.session.user;
//                 $(".current_user").text($scope.vk.data.user.first_name);
            console.log($scope.vk.data.user)
            $('html').css("cursor","wait")
            setTimeout(function () {
                $(".current_file").slideDown("slow", function () {
                    $(".current_file").css("display","flex")
                })
                $scope.place = "Albums";
                $(".nav div:first-of-type").click();
                $('html').css("cursor","default")
            },5500)
        }else alert("Авторизоваться не удалось!");
        VK.Api.call('photos.getAlbums', {owner_id: $scope.vk.data.user.id, need_system: 1, need_covers: 1}, function (r) {
            var albums =[];
            if (r.response) {
                for (var i=0; i<r.response.length; i++) {
                    if (r.response[i].size > 0) {
                        var obj = {id: r.response[i].aid, title: r.response[i].title, cover: r.response[i].thumb_src,};
                        albums[albums.length] = obj;

                    }
                }
                $scope.vk.albums = albums;
                console.log($scope.vk.albums);
            }
        })

        setTimeout( function () {
            for (var i = 0; i<$scope.vk.albums.length; i++) {
                VK.Api.call('photos.get', {owner_id: $scope.vk.data.user.id, album_id: $scope.vk.albums[i].id, extended: 1, count: 1000}, function (r) {
                    if (r.response) {
                        var obj = {album_id: r.response[0].aid, album_content: r.response, album_title: null};
                        $scope.vk.albums_content[$scope.vk.albums_content.length] = obj;
                    }
                })
            }
            setTimeout(function () {
                for (var i=0; i<$scope.vk.albums.length; i++) {
                    for (var j = 0; j < $scope.vk.albums_content.length; j++) {
                        if ($scope.vk.albums[i].id == $scope.vk.albums_content[j].album_id) {
                            $scope.vk.albums_content[j].album_title = $scope.vk.albums[i].title;
                            $scope.vk.albums_content[j].album_cover = $scope.vk.albums[i].cover;
                        }
                    }
                }
                console.log($scope.vk.albums_content)
            },1000)
        },4000)
    }
    $scope.currentNav = function (event) {
        $(".nav div").removeClass("current_nav").addClass("not_current_nav")
        event.currentTarget.setAttribute("class", "current_nav")
    }
    $scope.Back = function () {
        if ($scope.place == "BigPhoto") $scope.place = "Photos";
        else if ($scope.place == "Photos") $scope.place = "Albums";
    }
     $scope.Next = function () {
        if ($scope.place == "Albums") {
             $scope.place = "Photos";
             $scope.currentIdAlbum = event.currentTarget.getAttribute("id");
             $scope.current_album = event.currentTarget.getAttribute("data-title")
        }
        else if ($scope.place == "Photos") {
            $scope.place = "BigPhoto";
            $scope.currentIdPhoto = event.currentTarget.getAttribute("data-id");
        }
    }
  
})
    
