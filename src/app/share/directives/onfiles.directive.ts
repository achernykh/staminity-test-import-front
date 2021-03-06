export const onFiles = () => {
    return {
        scope: {
            onFiles: "<",
        },

        link(scope, element, attributes) {
            const onFiles = (event) => (scope) => scope.onFiles(event.target.files);
            element.bind("change", (event) => scope.$apply(onFiles(event)));
        },
    };
};