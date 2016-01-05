/**
 * Created by Neema on 10/21/2015.
 */
var emp=angular.module('appService', ['ngRoute']);
emp.config(function($routeProvider) {
    $routeProvider
        .when('/EmplList', {
            templateUrl: 'empDir.html',
            controller: 'EmpDirController'
        })
        .when('/EmplDet/:param', {
            templateUrl: 'emplDet.html',
            controller: 'EmpDetController'
        })
        .when('/EmplCreate', {
            templateUrl: 'createEmp.html',
            controller: 'EmpCreateController'
        })
        .when('/EmplRep/:param', {
            templateUrl: 'directRep.html',
            controller: 'EmpReportController'
        })
        .otherwise({
            redirectTo: '/EmplList'
        });
});
emp.service('EmplService', function($http) {
//simply returns the employee list
    this.empList = function () {
       return $http.get("/emplList")
            .success(function(data){
        });
    }

    this.empDet = function (id) {
        return $http.get('/emplList/'+ id).success(function(data){
        });
    }

    this.Save = function(newEmp) {
        return $http.post('/createEmpl',newEmp).success(function(data){
            //console.log(data);
        });
    }

    this.update = function (newEmp) {

            $http.put('/emplList/'+ newEmp._id ,newEmp).success(function(data){
                console.log(data);
            });


    }

    this.updRep = function(rep,id) {
        return $http.put('/updateManager/'+id ,rep).success(function(data){
            console.log(data);
        });
    }

    this.delete = function (id) {
        $http.delete('/emplList/' + id).success(function(data){

        });
    }
});

emp.controller('EmpDirController', function ($scope,$http,$location, EmplService) {

    var refresh= function () {
        EmplService.empList()
            .success(function(data) {
                $scope.emplList=data;
                console.log($scope.emplList);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    refresh();

    $scope.remove = function (id) {
        $scope.rep=[];
        $scope.empl_id=id;

        EmplService.empDet($scope.empl_id)
            .success(function(data1) {
                $scope.mger_id=data1.Manager;
                EmplService.empDet($scope.mger_id)
                    .success(function(data2) {
                        if(data2.Reports != null){
                           $scope.rep = data2.Reports;
                        }
                        for(i=0;i<$scope.rep.length;i++){
                            if($scope.rep[i] == $scope.empl_id){
                                console.log($scope.rep[i]);
                                $scope.rep.splice(i,1);
                            }
                        }
                        EmplService.updRep($scope.rep,$scope.mger_id)
                           .success(function(doc) {
                           })
                        })
                    })

        EmplService.delete(id);
        refresh();
    }

});

emp.controller('EmpDetController', function ($scope,$http,$routeParams,$location, EmplService) {

    EmplService.empList()
        .success(function(data) {
            $scope.emplList=data;
            console.log($scope.emplList);
        });
    $scope.items="";
    EmplService.empDet($routeParams.param)
        .success(function(data) {
            $scope.emplDet=data;
            if($scope.emplDet.Manager== null){
                $scope.emplDet.Manager= $scope.emplDet._id;

            }else {
                EmplService.empDet($scope.emplDet.Manager)
                    .success(function (data1) {
                        $scope.managerDet = data1;
                    })
            }
            for(id in $scope.emplDet.Reports)
            {
                $scope.items= $scope.emplDet.Reports[id] + "-"+ $scope.items ;
            }

            })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.update = function () {
        EmplService.update($scope.emplDet);
        console.log($scope.emplDet);
        $location.path( "/EmplList" );
    }



});

emp.controller('EmpReportController', function ($scope,$http,$routeParams, EmplService) {
    $scope.emplDet = [];
    $scope.id = $routeParams.param.split('-');
    //$scope.emplDet="";
    for(id in $scope.id)
    {
        if(($scope.id[id]) !="") {

            EmplService.empDet($scope.id[id])
                .success(function (data) {
                    $scope.emplDet.push(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        }
    }


});

emp.controller('EmpCreateController', function ($scope,$http,$location, EmplService) {

    EmplService.empList()
        .success(function(data) {
            $scope.emplList=data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.add = function () {
        $scope.rep=[];
        $scope.id=$scope.newEmp.Manager;

        EmplService.Save($scope.newEmp)
            .success(function(newId) {
                console.log(newId);

                EmplService.empDet($scope.id)
                    .success(function(data1) {
                        if(data1.Reports != null){
                        $scope.rep = data1.Reports;
                        }

                        $scope.rep.splice(0, 0, newId);

                        EmplService.updRep($scope.rep,$scope.id)
                            .success(function(data2) {

                            })
                    })
            })
       // console.log($scope.manag);

        $scope.newEmp = {};
        $location.path( "/EmplList" );
    }


});