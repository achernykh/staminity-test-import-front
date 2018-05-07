export const autoFocus = () => {
    return {
        link: {
            post(scope, element, attr) {
                element[0].focus();
            },
        },
    };
};