import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';

// Demo
import { Dashboard } from './app/demo/pages/dashboard/dashboard';
import { Documentation } from './app/demo/pages/documentation/documentation';
import { Landing } from './app/demo/pages/landing/landing';
import { Notfound } from './app/demo/pages/notfound/notfound';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [


            // Demo routes
            {
                path: 'demo',
                children: [
                    { path: '', component: Dashboard },
                    { path: 'dashboard', component: Dashboard },
                    { path: 'uikit', loadChildren: () => import('./app/demo/pages/uikit/uikit.routes') },
                    { path: 'documentation', component: Documentation },
                    { path: 'pages', loadChildren: () => import('./app/demo/pages/demo.routes') },
                ]
            }

        ]
    },
    { path: 'demo/auth', loadChildren: () => import('./app/demo/pages/auth/auth.routes') },
    { path: 'demo/landing', component: Landing },

    // Error pages
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' }
];
