myApp.controller("SecurityCtrl", ['$scope', 'AuthenticationFactory', 'StellarApi',
	function($scope, AuthenticationFactory, StellarApi) {
		$scope.mode = 'security';
		$scope.isMode = function(mode) {
			return $scope.mode === mode;
	    }
		$scope.setMode = function(mode) {
			return $scope.mode = mode;
	    }
	
		$scope.keyOpen = JSON.parse(AuthenticationFactory.userBlob).masterkey;
		$scope.key = $scope.keyOpen[0] + new Array($scope.keyOpen.length).join("*");
		
	    $scope.showSec = function(flag) {
			$scope.showSecret = flag;
		};
		
		
		$scope.inflation = '';
		$scope.inflation_working = false;
		$scope.inflation_error = '';
		$scope.inflation_done = false;
		$scope.refresh = function() {
			StellarApi.getInfo(null, function(err, data) {
				if (err) {
					if (err.message) {
						$scope.inflation_error = err.message;
					} else {
						if (err.extras && err.extras.result_xdr) {
							var resultXdr = StellarSdk.xdr.TransactionResult.fromXDR(err.extras.result_xdr, 'base64');
							$scope.inflation_error = resultXdr.result().results()[0].value().value().switch().name;
						} else {
							console.error("Unhandle!!", err);
						}
					}
				} else {
					$scope.inflation = data.inflation_destination;
					$scope.$apply();
				}
			});
		};
		
		$scope.setInflation = function() {
			$scope.inflation_error = '';
			$scope.inflation_done = false;
			$scope.inflation_working = true;
			StellarApi.setOption('inflationDest', $scope.inflation, function(err, hash){
				$scope.inflation_working = false;
				if (err) {
					if (err.message) {
						$scope.inflation_error = err.message;
					} else {
						if (err.extras && err.extras.result_xdr) {
							var resultXdr = StellarSdk.xdr.TransactionResult.fromXDR(err.extras.result_xdr, 'base64');
							$scope.inflation_error = resultXdr.result().results()[0].value().value().switch().name;
						} else {
							console.error("Unhandle!!", err);
						}
					}
				} else {
					$scope.inflation_done = true;
				}
				$scope.$apply();
			});
		};
		$scope.setInflationFox = function() {
			$scope.inflation = 'GBXXGZGNA6DQ5U4LKF6FP3QNXIZ4X3OTSRXYRV36N5UPKB5JG6Y3ROCK';
			$scope.setInflation();
		}
		
		$scope.refresh();
	}
]);