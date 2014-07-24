
var myApp = angular.module('myApp', ['ngGrid', 'LocalStorageModule', 'ui.bootstrap']);

  myApp.controller('SRCtrl', ['$scope', '$http', 'localStorageService', '$modal', function($scope,$http,localStorageService,$modal) {
    
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

    // Templates
    $scope.templates = [
      {
        'id': 1,
        'name': 'New SR',
        'snippet': "Name,\n\nI've taken ownership of this Service Request and will be your contact for this SR. We have great resources here at Novell to assist us in identifying the problem and finding an acceptable solution. Technology is great when it works, and can be frustrating when software misbehaves. I want you to know that I will do everything I can to resolve this issue you are experiencing with our product.\n\n\nFeel free to contact me."
      },
      {
        'id': 2,
        'name': 'Bomgar Invitation',
        'snippet': "\nAre you available for a Bomgar session? \nThe session key below is valid below for the next 4 hours. You can connect by either of the following: \nURL\nOr http://www.websupport.com and enter NUMBER as the session key."
      },
      {
        'id': 3,
        'name': 'EMEA',
        'snippet': "\nI see our timezones are very different. Are you available to work this issue now? I will keep this Service Request until the end of my shift. If I do not receive an email back from you, I'll go ahead and put this Service Request in the queue for the team in your timezone."
      },
      {
        'id': 4,
        'name': 'Schedule to Close',
        'snippet': "\nJust checking in to verify the issue has been resolved. I'll be placing this SR in a Schedule to Close state. If I don't hear back from you, I'll go ahead and close the SR. Feel free to contact me."
      },
      {
        'id': 5,
        'name': 'Close',
        'snippet': "\nI'll be closing this Service Request. If the issue returns, feel free to contact me within 14 days and I will reopen the SR."
      },
      {
        'id': 6,
        'name': 'Support Config',
        'snippet': "\nLet's start by getting a support config. Most SLES Servers have the following tool by default.\n\nPlease execute the following command on the eDirectory server:\nsupportconfig -ur <SR#>\n\nThis will automatically upload the servers configuration information and attach it to the SR."
      }
    ];

    $scope.handleTemplate = function(template) {
      $scope.editorContent.insertText($scope.editorContent.getLength(), template.snippet + '\n');
    };

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
      checkboxHeaderTemplate: '<input class="ngSelectionHeader" type="checkbox" ng-model="allSelected" ng-change="toggleSelectAll(allSelected)"/>',
      plugins: [new ngGridFlexibleHeightPlugin()],
      selectedItems: $scope.selectedRows,
      enableRowSelection: true,
      enableCellEditOnFocus: true,
      enableColumnResize: true,
      enableColumnReordering: true,
      showFilter:true,
      showColumnMenu: true,
      showFooter: true,
      columnDefs: [{field: 'CREATEDON', displayName: 'Created On', enableCellEdit: false, cellFilter: 'date:\'mediumDate\'', width:'**', cellClass: 'grid-align-center'},
                   {field: 'SR', displayName: 'SR', enableCellEdit: false, width:'**'},
                   {field: 'CUSTOMERNAME', displayName: 'Name', enableCellEdit: false, width:'***'},
                   {field: 'PRIMARYEMAIL', displayName: 'Primary', enableCellEdit: true, width:'****'},
                   {field: 'ALTERNATECONTACT', displayName: 'Alternate', enableCellEdit: true, width:'****'},
                   {field: 'STATUS', displayName: 'Status', enableCellEdit: false, width:'***'},
                   {field: 'BRIEF', displayName: 'Brief Description', enableCellEdit: true, width:'********'},
                   {field: 'LASTACTIVITYDATE', displayName: 'Date', enableCellEdit: false, cellFilter: 'date:\'mediumDate\'', width:'**', cellClass: 'grid-align-center'},
                   {field: 'LASTACTIVITY', displayName: 'Last Activity', enableCellEdit: true, width:'**********'}],
      sortInfo: { fields: ['LASTACTIVITYDATE'], directions: ['asc'] }
    };

    // angular-ui bootstrap modal
    $scope.open = function (size) {

      preview = "<div class=\"modal-header\"><button type=\"button\" class=\"close\" ng-click=\"no()\">×</button><h4 class=\"modal-title ng-binding\"><span class=\"glyphicon glyphicon-check\"></span> Please Confirm</h4></div><div class=\"modal-body\">"+ $scope.editorContent.getHTML() + $scope.editorSignature.getHTML() +"</div><div class=\"modal-footer\"><button class=\"btn btn-primary\" ng-click=\"ok()\">OK</button><button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button></div>";
  
      $scope.modalInstance = $modal.open({
        template: preview,
        controller: $scope.ModalInstanceCtrl
      });

    };

    $scope.ModalInstanceCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close();
        // $scope.getServiceRequests();
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
          var body = data;
          body.forEach(function(item){ 
            item.CREATEDON = new Date(Date.parse(item.CREATEDON)); 
            item.LASTACTIVITYDATE = new Date(Date.parse(item.LASTACTIVITYDATE)); 
          });
          $scope.myData = body;
          toastr.success('Received Service Requests.');
          $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();
          

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
          var res = JSON.stringify(data);
          toastr.success(JSON.parse(res));
          $scope.toggleClass($scope.blurMe, 'blur'); $scope.spinner.stop();
          $scope.editorContent.setHTML('');
          $scope.gridOptions.$gridScope.toggleSelectAll(false);
        }).error(function (data, status, headers, config) {
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