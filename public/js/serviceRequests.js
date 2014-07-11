
var myApp = angular.module('myApp', ['ngGrid']);

  myApp.controller('SRCtrl', ['$scope', '$http', function($scope,$http) {

    // Initialize editor with custom theme and modules
    $scope.editorContent = new Quill('#content', {
      modules: {
        'toolbar': { container: '#toolbar-content' }
      },
      theme: 'snow'
    });
    $scope.editorSignature = new Quill('#signature', {
      modules: {
        'toolbar': { container: '#toolbar-signature' }
      },
      theme: 'snow'
    });

    $scope.selectedRows=[];
    $scope.formData = {
      "engineer": undefined,
      "password": undefined,
      "fromUser": true,
      "emails": $scope.selectedRows,
      "content": undefined,
      "signature": undefined
    };

    $scope.gridOptions = {
      data: 'myData',
      selectedItems: $scope.selectedRows,
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
        data: JSON.stringify({ 'engineer': $scope.formData.engineer }),
        headers: {'Content-Type': 'application/json'},
        timeout: 2000
      }).success(function (data, status, headers, config) {
          var res = JSON.parse(JSON.parse(data));
          toastr.success('Successful Request.');

          $scope.myData = res;

        }).error(function (data, status, headers, config) {
            toastr.error('Failed Request!');
            console.error(data);
        });
    };

    $scope.sendMail = function(){
      $scope.formData.content = $scope.editorContent.getHTML();
      $scope.formData.signature = $scope.editorSignature.getHTML();
      
      $http({
        url: 'sendMail',
        method: "POST",
        data: JSON.stringify($scope.formData),
        headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
          var res = JSON.parse(data);
          toastr.success(res);
        }).error(function (data, status, headers, config) {
            // $("#userid").notify(data.message, { className: 'error', elementPosition:"botom left" });
            toastr.error(headers);
            console.error(data);   
        });
    };

  }]);
