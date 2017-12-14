var myApp = angular.module("myModule",[]);

myApp.controller('myControllerLogin', ['$scope', '$http', '$window', function($scope,$http,$window){
	
	var loginIcon = {
		name : "Login",
		loginPngLoc : "/Images/login.png",
		message : "Sign In"
	};
	$scope.loginIcon = loginIcon ;
			
	$scope.submitLoginData = function(){
	var data = {
		username: $scope.userName,
		password : $scope.password
	}
		
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/loginData/', 
		   data: data  
		}).then(function successCallback(response) {
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
					window.location.replace("http://13.126.20.198:8083/requestTable.html");
			}else{
				alert(response.data.message);
			}				
		});
	}
	
}]);

myApp.controller('myControllerRequest', ['$scope', '$http', '$window','$filter' ,function($scope,$http,$window,$filter){
	
	$scope.admission = true;
	
	$scope.isDataForPublish = false; 
	
	$scope.publish = false;
	
	$scope.coursenames = ["Ancient History", "Computer Science", "Microservices"];
		
	$scope.degrees = ["UG", "PG"];
			
	$scope.batches = ["2010-2014", "2014-2017", "2017-2020"];
	
	$scope.showAdmissionPortal = function(){
		$scope.admission = true;		
		$scope.publish = false;
	}
	
	$scope.showPublishPortal = function(){
		$scope.admission = false;		
		$scope.publish = true;							
	}

	$scope.addGradDate = function(){
      var message = [];
	  var j = 0;
      for (var i = 0; i < $scope.publishData.length; i++) {
        if ($scope.publishData[i].Selected) {
           var studentId = $scope.publishData[i]._id;
           message [j]= studentId ;
		   j++;
           }
      }
	  
	  var data = {
		  graduationDate : $filter('date')($scope.graduationDate,'yyyy-MM-dd'),
		  data : message
	  }
	  console.log(data);
	  if(message.length > 0){
		$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/addGradDate/', 
		   data: data
		}).then(function successCallback(response) {
		console.log(response);
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				window.location.replace("http://13.126.20.198:8083/requestTable.html");
			}else{
				alert(response.data.message);
			}		 
		});
	  }else{
		  alert("Please select some candidates");
	  }
    }

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.publishData, function (x) {
            x.Selected = $scope.selectedAll;
        });
	}

    $scope.searchData = function(){
    
		var data = {
                course: $scope.selectedCourse,
                degree: $scope.selectedDegree
        }
		
		console.log(data);
		        
        $http({
            method: 'POST',
            url: 'http://13.126.20.198:8083/searchApplicants/',
            data: data 
            }).then(function successCallback(response) {
            if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				console.log(response);
				$scope.publishData = response.data.message;
				if(response.data.message.length > 0){
					$scope.isDataForPublish = true;
				}else{
					alert("No data found for selected filters")
				}
            }else{
                alert(response.data.message);
            }                                                             
        });                                                                                                          
    }

	
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/requestTableData/', 
		}).then(function successCallback(response) {
			console.log(response);
						console.log(response.data.status);			
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
					$scope.requestTableData = response.data.message.rows;
			}else{
				alert(response.data.message);
			}				
		});
		

	$scope.getApplicantData = function(clickedData){
	
		var data = {
				id: clickedData.doc.digitalId,
		};
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/applicantData/', 
		   data: data  
		}).then(function successCallback(response) {
			console.log(response);
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				var applicantData = response.data.message;
				applicantData["requestId"] = clickedData.doc._id;
				console.log(applicantData);
				$window.sessionStorage.setItem("Mydata",JSON.stringify(applicantData));
				window.location.replace("http://13.126.20.198:8083/UniversityData.html");				
			}else{
				alert(response.data.message);
			}				
		});		
	}
}]);

myApp.controller('myControllerStudent', ['$scope', '$http', '$window', function($scope,$http,$window){
	$scope.success = false;
	$scope.failure = false;

	$scope.coursenames = ["Ancient History", "Computer Science", "Microservices"];
	
	var loginIcon = {
		name : "Login",
		loginPngLoc : "/Images/login.png",
		message : "Sign In"
	};
	$scope.loginIcon = loginIcon ;
	
	var successIcon = {
		name : "Verify",
		successPngLoc : "/Images/Success.png",
		message : "Success"
	};
	$scope.successIcon = successIcon ;
	
	var errorIcon = {
		name : "Not verified",
		errorPngLoc : "/Images/error.png",
		message : "Error"
	};
	$scope.errorIcon = errorIcon ;

	$scope.selectedApplicantData = JSON.parse($window.sessionStorage.getItem("Mydata"));
	console.log($scope.selectedApplicantData);
	$scope.attachment = Object.keys($scope.selectedApplicantData._attachments)[0];
	$scope.dateOfBirth = new Date($scope.selectedApplicantData.dob);

	$scope.verify = function(){
	
		var data = {
				id: $scope.selectedApplicantData.digitalId
		};
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/verifyDigitalIdStatus/', 
		   data: data  
		}).then(function successCallback(response) {
			console.log(response);
			if(JSON.stringify(response) != '{}' && response.data.message == "Success"){
				$scope.success = true;			
			}else{
				$scope.failure = true;
			}				
		});		
	}	
	
	$scope.updateStatus = function(buttonValue){
		var digitalIdVerified = "No";
		
		if($scope.success){
			digitalIdVerified = "Yes";	
		}
		
		var data = {
				id: $scope.selectedApplicantData.digitalId,
				status : buttonValue,
				digitalIdVerified : digitalIdVerified
		};
	$http(
		{
		   method: 'POST',
		   url: 'http://13.126.20.198:8083/applicantDataStatus/', 
		   data: data  
		}).then(function successCallback(response) {
			if(JSON.stringify(response) != '{}' && response.data.status == "200"){
				window.location.replace("http://13.126.20.198:8083/requestTable.html");				
			}else{
				alert(response.data.message);
			}				
		});		
	}
	
	$scope.moveToRequestTable = function(clickedData){
		window.location.replace("http://13.126.20.198:8083/requestTable.html");						
	}
}]);