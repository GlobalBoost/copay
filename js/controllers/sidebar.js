'use strict';

angular.module('copayApp.controllers').controller('SidebarController', function($scope, $rootScope, $location, controllerUtils) {

  $scope.menu = [{
    'title': 'Receive',
    'icon': 'fi-download',
    'link': 'receive'
  }, {
    'title': 'Send',
    'icon': 'fi-arrow-right',
    'link': 'send'
  }, {
    'title': 'History',
    'icon': 'fi-clipboard-pencil',
    'link': 'history'
  }, {
    'title': 'Settings',
    'icon': 'fi-widget',
    'link': 'more'
  }];

  $scope.refresh = function() {
    var w = $rootScope.wallet;
    if (!w) return;

    if (w.isReady()) {
      w.sendWalletReady();
      if ($rootScope.addrInfos.length > 0) {
        controllerUtils.clearBalanceCache(w);
        controllerUtils.updateBalance(w, function() {
          $rootScope.$digest();
        });
      }
    }
  };

  $scope.signout = function() {
    $scope.$emit('signout');
  };

  $scope.isActive = function(item) {
    return item.link && item.link == $location.path().split('/')[1];
  };

  if ($rootScope.wallet) {
    $rootScope.$watch('wallet.id', function() {
      $scope.walletSelection = false;
    });
  }

  $scope.switchWallet = function(wid) {
    controllerUtils.setFocusedWallet(wid);
  };

  $scope.toggleWalletSelection = function() {
    $scope.walletSelection = !$scope.walletSelection;
    if (!$scope.walletSelection) return;

    $scope.wallets = [];
    var wids = _.pluck($rootScope.iden.listWallets(), 'id');
    _.each(wids, function(wid) {
      if (controllerUtils.isFocusedWallet(wid)) return;
      var w = $rootScope.iden.getWalletById(wid);
      $scope.wallets.push(w);
      controllerUtils.updateBalance(w, function(err, res) {
        if (err) return;
        setTimeout(function() {
          $scope.$digest();
        }, 1);
      });
    });
  };
});