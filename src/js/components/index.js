function onFiles() {
    return {
        scope: {
            onFiles: "<"
        },

        link (scope, element, attributes) {
            let onFiles = (event) => (scope) => { scope.onFiles(event.target.files) };
            element.bind("change", (event) => { scope.$apply(onFiles(event)) });
        }
    };
}


angular.module('staminity.components', [])
    .directive("onFiles", onFiles);