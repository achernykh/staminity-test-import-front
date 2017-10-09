import { NewPageComponent } from './new-page.component';

/**
 * This state allows the user to set their application preferences
 */
export const newPageState = {
    //parent: 'app',
    name: 'new-page',
    url: '/new-page',
    views: {
        application: {
            component: NewPageComponent
        }
    }
};