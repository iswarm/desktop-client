myApp.controller('LoginCtrl', ['$scope', '$rootScope', '$window', '$location', 'FileDialog', 'UserAuthFactory', 'AuthenticationFactory',
  function($scope, $rootScope, $window, $location, FileDialog, UserAuthFactory, AuthenticationFactory) {
	$scope.fileInputClick = function() {
		FileDialog.openFile(function(filename) {
			    console.log("filename = " + filename.name);
	        $scope.$apply(function() {
	          $scope.walletfile = filename;
	          
	        });
	    }, false);
	};
	
	$scope.submitForm = function(){
		if (!$scope.walletfile) {
	        $scope.error = 'Please select a wallet file.';
	        return;
	    }
		$scope.backendMessages = [];
		UserAuthFactory.openfile($scope.walletfile, $scope.password, function(err, blob){
			$scope.$apply(function(){
				if (err) {
					$scope.error = 'Login failed: Wallet file or password is wrong.';
		            return;
		        };
		        if (blob.data.account_id.substring(0, 1) == "r") {
		        	console.error(blob.data.account_id);
		        	$scope.error = 'Login failed: Wallet file is a Ripple file.';
		        	return;
		        }
		        
		        AuthenticationFactory.userBlob = JSON.stringify(blob.data);
		        $window.sessionStorage.userBlob = AuthenticationFactory.userBlob;
		        $rootScope.$broadcast('$blobUpdate');
				$location.path('/balance');
	        });
		});
	}
  }
]);

myApp.controller('RegisterCtrl', ['$scope', '$rootScope', '$window', '$location', 'FileDialog', 'UserAuthFactory', 'AuthenticationFactory', 'StellarApi',
   function($scope, $rootScope, $window, $location, FileDialog, UserAuthFactory, AuthenticationFactory, StellarApi) {
	$scope.password = '';
	$scope.passwordSet = {};
	$scope.password1 = '';
	$scope.password2 = '';
	$scope.master = '';
	$scope.key = '';
	$scope.mode = 'register_new_account';
	$scope.showMasterKeyInput = false;
	$scope.submitLoading = false;
	
	$scope.changeMode = function(mode) {
		$scope.mode = mode;
	};
	$scope.showPass = function(flag) {
		$scope.showPassword = flag;
	};
	$scope.showSec = function(flag) {
		$scope.showSecret = flag;
	};
	
	$scope.reset = function() {
		$scope.password = '';
		$scope.password1 = '';
		$scope.password2 = '';
		$scope.masterkey = '';
		$scope.key = '';
		$scope.mode = 'register_new_account';
		$scope.showMasterKeyInput = false;
		$scope.submitLoading = false;
		
		if ($scope.registerForm) $scope.registerForm.$setPristine(true);
	};
	
	$scope.fileInputClick = function() {
		FileDialog.saveAs(function(filename) {
	        $scope.$apply(function() {
	          $scope.walletfile = filename;
	          $scope.mode = 'register_empty_wallet';
	          $scope.save_error = '';
	        });
	    }, 'wallet.txt');
	};

	$scope.submitForm = function() {
		$scope.masterkey = $scope.masterkey ? $scope.masterkey : StellarApi.random().secret;
		$scope.address = StellarApi.getAddress($scope.masterkey);
		
		var options = {
			'account': $scope.address,
            'password': $scope.password1,
            'masterkey': $scope.masterkey,
            'walletfile': $scope.walletfile
		};
		console.log(options);
		UserAuthFactory.register(options, function(err, blob){
			if (err) {
				console.error('Register failed!', err);
				$scope.save_error = err.message;
				$scope.$apply();
				return;
			}
			$scope.password = new Array($scope.password1.length+1).join("*");
	        $scope.keyOpen = $scope.masterkey;
	        $scope.key = $scope.keyOpen[0] + new Array($scope.keyOpen.length).join("*");
	        
	        console.log('key:', $scope.masterkey);
	        console.log($scope.password, $scope.key)
	        
	        AuthenticationFactory.userBlob = JSON.stringify(blob.data);
	        $window.sessionStorage.userBlob = AuthenticationFactory.userBlob;
	        console.log('$window.sessionStorage.userBlob', $window.sessionStorage.userBlob);
	        
	        $rootScope.$broadcast('$blobUpdate');
	        
	        $scope.$apply(function(){
	        	$scope.mode = 'welcome';
	        });
		});
	};
	
	$scope.submitSecretKeyForm = function(){
		$scope.masterkey = $scope.secretKey;
	    $scope.fileInputClick();
	};
	
	$scope.gotoFund = function() {
		$scope.mode = 'register_empty_wallet';
	    $scope.reset();

	    $location.path('/balance');
	};
	
   }
 ]);
