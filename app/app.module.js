(() => {
    'use strict';

    angular
        .module('nykreditapp', [
            'ui.router'
        ])
        .config(($stateProvider, $urlRouterProvider) => {
            $stateProvider.state({
                name: 'dashboard',
                url: '/dashboard',
                component: 'dashboardComponent'
            });

            $urlRouterProvider.when('', '/dashboard');
        })
})();