
var myApp = angular.module('myApp', ['ngGrid', 'LocalStorageModule']);
  
  myApp.controller('SRCtrl', ['$scope', '$http', 'localStorageService', function($scope,$http,localStorageService) {

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
      "ccSupport": true,
      "emails": $scope.selectedRows,
      "content": undefined,
      "signature": undefined
    };

    $scope.setFromUser = function(boolean){
      $scope.formData.fromUser = boolean;
      // TO-DO: Working on a way to replace my dependency on home.js (uses jQuery)
      // $scope.toggleClass(element, 'active');
      // $scope.toggleClass(element, 'btn-primary');
      // $scope.toggleClass(element, 'btn-default');
    }

    $scope.toggleClass = function(element, className){
      if (!element || !className){
          return;
      }

      var classString = element.className, 
          nameIndex = classString.indexOf(className);

      if (nameIndex == -1) {
          classString += ' ' + className;
      }
      else {
          classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
      }
      element.className = classString;
    }

    $scope.init = function(){
      // Local Storage: rememberMe (Retrieve from store)
      if(localStorageService.isSupported){
        console.log('Retrieving values from localStorage');
        $scope.formData.engineer = localStorageService.get('engineer'),
        $scope.formData.password = localStorageService.get('password'),
        $scope.formData.fromUser = localStorageService.get('fromUser'),
        $scope.formData.signature = localStorageService.get('signature');

        if ($scope.formData.signature !== undefined) $scope.editorSignature.setHTML($scope.formData.signature);

        if($scope.formData.engineer || $scope.formData.password || $scope.formData.fromUser || $scope.formData.signature) {
          document.getElementById('rememberMe').checked = true;
        }

        $scope.srContent = document.getElementById('spinner');

      }
    }

    $scope.spinIt = function(element){

      var target = document.getElementById(element);
      $scope.spinner = new Spinner({
        lines: 9,
        length: 0,
        width: 12,
        radius: 26,
        corners: 1.0,
        rotate: 0,
        trail: 48,
        speed: 0.9,
        direction: 1
      }).spin(target);

    }

    $scope.gridOptions = {
      data: 'myData',
      selectedItems: $scope.selectedRows,
      enableRowSelection: true,
      enableCellEditOnFocus: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter:true,
      showColumnMenu: true,
      columnDefs: [{field: 'sr', displayName: 'SR', enableCellEdit: false, width:'**'},
                   {field: 'status', displayName: 'Status', enableCellEdit: false, width:'***'},
                   {field: 'lastActivityDate', displayName: 'Last Activity Date', enableCellEdit: false, cellFilter: 'date:\'mediumDate\'', width:'***'},
                   {field: 'primaryContact', displayName: 'Primary', enableCellEdit: true, width:'****'},
                   {field: 'alternateContact', displayName: 'Alternate', enableCellEdit: true, width:'****'},
                   {field: 'brief', displayName: 'Brief Description', enableCellEdit: true, width:'********'}],
      sortInfo: { fields: ['lastActivityDate'], directions: ['asc'] }
    };

    $scope.getServiceRequests = function() {
      $scope.spinIt('srContent');
      console.log($scope.formData.ccSupport);

      $scope.rememberMe();
      $http({
        url: 'getServiceRequests',
        method: "POST",
        data: JSON.stringify({ 'engineer': $scope.formData.engineer }),
        headers: {'Content-Type': 'application/json'},
        timeout: 2000
      }).success(function (data, status, headers, config) {
          var res = JSON.parse(JSON.parse(data));
          toastr.success('Received Service Requests.');

          $scope.spinner.stop();
          $scope.myData = res;

        }).error(function (data, status, headers, config) {
            toastr.error('Failed to retrieve service requests!');
            console.error(data);
            $scope.spinner.stop();
        });

    };

    $scope.sendMail = function(){
      $scope.spinIt('srContent');
      $scope.rememberMe();
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
          $scope.spinner.stop();
          $scope.editorContent.setHTML('');
          $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }).error(function (data, status, headers, config) {
            // $("#userid").notify(data.message, { className: 'error', elementPosition:"botom left" });
            toastr.error(headers);
            console.error(data); 
            $scope.spinner.stop();  
        });

      toastr.info('Request sent to server.');
    };

    $scope.rememberMe = function() {
      if(localStorageService.isSupported) {
        console.log('Checking values for rememberMe', document.getElementById('rememberMe').checked);
        if(document.getElementById('rememberMe').checked){
          console.log('Saving values to localStorage');
          localStorageService.set('engineer', $scope.formData.engineer);
          localStorageService.set('password', $scope.formData.password);
          localStorageService.set('fromUser', $scope.formData.fromUser);
          localStorageService.set('signature', $scope.editorSignature.getHTML());
      } else {
        localStorageService.clearAll();
      }
    }
      
    }

  }]);
