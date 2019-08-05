"use strict";

var githubApp = angular.module('app', []);
githubApp.controller('gitApi', ['$scope', '$http', '$q', function($scope, $http, $q) {
  $scope.searchRepository = 'github';
  $http.get("https://api.github.com/users/"+ $scope.searchRepository)
    .success(function(data) {
      $scope.userData = data;
      loadOrgsRepos();
    });
  
  $scope.GetRepositories = function() {
      loadOrgsRepos();
  };
  var loadOrgsRepos = function() {
    $http.get("https://api.github.com/search/repositories?q="+ $scope.searchRepository +"+in:name")
      .success(function(data) {

        $scope.orgsData = data.items;

        var contribs = [];
        for (var i in data.items) {
          contribs.push(data.items[i].contributors_url);
        }

        $q.all(contribs.map(function(item) {
            return $http({
              method: 'GET',
              url: item
            });
          }))
          .then(function(results) {
            results.forEach(function(val, i) {
              $scope.orgsData[i].contributors = val.data;
            });
          });
      });
  }

  $scope.repo_sort = '-updated_at';
  $scope.contrib_sort = '-contributions'
}]);