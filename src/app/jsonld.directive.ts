export const jsonld = ($filter, $sce) => ({
    restrict: 'E',
    template: '<script type="application/ld+json" ng-bind-html="onGetJson()"></script>',
    scope: {
        json: '=json'
    },
    link: (scope, element, attrs) => {
        scope.onGetJson = () => $sce.trustAsHtml($filter('json')(scope.json));
    },
    replace: true
});