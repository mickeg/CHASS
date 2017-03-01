var app = angular.module('Chass',[]);

app.controller('ImageController', function($scope){
    
    $scope.image = {
        taxonId: 100146,
        name: "Skalbagge", 
        src: 
            [
                'http://127.0.0.1:8080/image?taxonId=100146&image=1',
                'http://127.0.0.1:8080/image?taxonId=100146&image=2',
                'http://127.0.0.1:8080/image?taxonId=100146&image=3',
                'http://127.0.0.1:8080/image?taxonId=100146&image=4'
            ]
    }
});