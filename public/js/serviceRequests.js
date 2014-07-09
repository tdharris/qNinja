
var myApp = angular.module('myApp', ['ngGrid']);

  myApp.controller('SRCtrl', ['$scope', '$http', function($scope,$http) {

    $scope.getServiceRequests = function() {
      console.log('clicked');
      console.log($scope.engineer);

      $http({
        url: 'getServiceRequests',
        method: "POST",
        data: JSON.stringify({ 'engineer': $scope.engineer }),
        headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
          $scope.persons = data; // assign  $scope.persons here as promise is resolved here 
          console.log(data);
        }).error(function (data, status, headers, config) {
            $scope.status = status;
            console.error(data);
        });
    };

    $scope.myData = [{name: "Moroni", age: 50},
                     {name: "Tiancum", age: 43},
                     {name: "Jacob", age: 27},
                     {name: "Nephi", age: 29},
                     {name: "Enos", age: 34}];
    $scope.gridOptions = { 
        data: 'myData'
    };  
  }]);