
var myApp = angular.module('myApp', ['ngGrid']);

  myApp.controller('SRCtrl', ['$scope', '$http', function($scope,$http) {

    $scope.gridOptions = {
      data: 'myData',
      selectedItems: $scope.selectedEntries,
      enableRowSelection: true,
      enableCellEditOnFocus: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter:true,
      columnDefs: [{field: 'sr', displayName: 'SR', enableCellEdit: false, width:'**'},
                   {field: 'status', displayName: 'Status', enableCellEdit: false, width:'***'},
                   {field: 'lastActivityDate', displayName: 'Last Activity Date', enableCellEdit: false, cellFilter: 'date:\'mediumDate\'', width:'***'},
                   {field: 'primaryContact', displayName: 'Primary', enableCellEdit: true, width:'****'},
                   {field: 'alternateContact', displayName: 'Alternate', enableCellEdit: true, width:'****'},
                   {field: 'brief', displayName: 'Brief Description', enableCellEdit: true, width:'********'}],
      sortInfo: { fields: ['lastActivityDate'], directions: ['asc'] }
    };

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
          var res = JSON.parse(JSON.parse(data));
          console.log(res);

          $scope.myData = res;

        }).error(function (data, status, headers, config) {
            $("#userid").notify(data.message, { className: 'error', elementPosition:"botom left" });
            console.error(data);
        });
    };

  }]);
