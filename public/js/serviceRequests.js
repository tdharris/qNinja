
var myApp = angular.module('myApp', ['ngGrid', 'LocalStorageModule', 'ui.bootstrap']);

  myApp.controller('SRCtrl', ['$scope', '$http', 'localStorageService', '$modal', function($scope,$http,localStorageService,$modal) {
    
    $scope.init = function(){
      // Local Storage: rememberMe (Retrieve from store)
      if(localStorageService.isSupported){

        $scope.formData.engineer = localStorageService.get('engineer'),
        $scope.formData.password = localStorageService.get('password'),
        $scope.formData.fromUser = localStorageService.get('fromUser'),
        $scope.formData.signature = localStorageService.get('signature');

        if($scope.formData.engineer || $scope.formData.password || $scope.formData.fromUser || $scope.formData.signature) {
          document.getElementById('rememberMe').checked = true;
        }

        // if ($scope.formData.engineer !== undefined) $scope.getServiceRequests();
        if ($scope.formData.signature !== undefined) $scope.editorSignature.setHTML($scope.formData.signature);
        $scope.srContent = document.getElementById('spinner');

      }

      $scope.blurMe = document.getElementById('blurMe');
    }

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
      "ccSupport": 'support@novell.com',
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

    $scope.spinIt = function(element){

      $scope.toggleClass($scope.blurMe, 'blur');
      // var target = document.getElementById(element);
      var target = document.body;
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
      plugins: [new ngGridFlexibleHeightPlugin()],
      selectedItems: $scope.selectedRows,
      enableRowSelection: true,
      enableCellEditOnFocus: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter:true,
      showColumnMenu: true,
      columnDefs: [{field: 'createdOn', displayName: 'Created On', enableCellEdit: false, width:'**', cellClass: 'grid-align-center', groupable: false},
                   {field: 'sr', displayName: 'SR', enableCellEdit: false, width:'**', groupable: false},
                   {field: 'customerName', displayName: 'Name', enableCellEdit: false, width:'**', groupable: false},
                   {field: 'primaryContact', displayName: 'Primary', enableCellEdit: true, width:'****', groupable: false},
                   {field: 'alternateContact', displayName: 'Alternate', enableCellEdit: true, width:'****', groupable: false},
                   {field: 'status', displayName: 'Status', enableCellEdit: false, width:'***', groupable: false},
                   {field: 'brief', displayName: 'Brief Description', enableCellEdit: true, width:'******', groupable: false},
                   {field: 'lastActivityDate', displayName: 'Last Activity Date', enableCellEdit: false, cellFilter: 'date:\'mediumDate\'', width:'**', cellClass: 'grid-align-center', groupable: false},
                   {field: 'lastActivity', displayName: 'Last Activity', enableCellEdit: false, width:'******', groupable: false}],
      sortInfo: { fields: ['lastActivityDate'], directions: ['asc'] }
    };

    // angular-ui bootstrap modal
    $scope.open = function (size) {

      // $scope.formData.content = $scope.editorContent.getHTML();
      // $scope.formData.signature = $scope.editorSignature.getHTML();
      $scope.items = $scope.editorContent.getHTML() + $scope.editorSignature.getHTML();

      $scope.modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: $scope.ModalInstanceCtrl,
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

    };

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance, items) {

      $scope.items = items;

      $scope.ok = function () {
        $modalInstance.close();
      };

      $scope.cancel = function () {
        $modalInstance.dismiss();
      };
    };

    $scope.getServiceRequests = function() {

      $scope.spinIt('spinMe'); 

      $scope.rememberMe();
      $http({
        url: 'getServiceRequests',
        method: "POST",
        data: JSON.stringify({ 'engineer': $scope.formData.engineer }),
        headers: {'Content-Type': 'application/json'},
        timeout: 2000
      }).success(function (data, status, headers, config) {
          var res = JSON.parse(JSON.parse(data));
          res.forEach(function(item){ 
            item.lastActivityDate = new Date(Date.parse(item.lastActivityDate)); 
          });
          toastr.success('Received Service Requests.');
          $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();
          $scope.myData = res;

        }).error(function (data, status, headers, config) {
            toastr.error('Failed to retrieve service requests!');
            console.error(data);
            $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();
        });

    };

    $scope.sendMail = function(){
      $scope.spinIt('spinMe'); 
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
          $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();
          $scope.editorContent.setHTML('');
          $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }).error(function (data, status, headers, config) {
            // $("#userid").notify(data.message, { className: 'error', elementPosition:"botom left" });
            toastr.error(headers);
            console.error(data); 
            $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();  
        });

    };

    $scope.rememberMe = function() {

      if(localStorageService.isSupported) {

        if(document.getElementById('rememberMe').checked){
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
