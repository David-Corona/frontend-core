import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Demo Components',
                icon: 'pi pi-fw pi-briefcase',
                expanded: false,
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/demo/dashboard']
                    },
                    {
                        label: 'UI Components',
                        icon: 'pi pi-fw pi-star-fill',
                        path: '/uikit',
                        items: [
                            { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/demo/uikit/formlayout'] },
                            { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/demo/uikit/input'] },
                            { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/demo/uikit/button'] },
                            { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/demo/uikit/table'] },
                            { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/demo/uikit/list'] },
                            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/demo/uikit/tree'] },
                            { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/demo/uikit/panel'] },
                            { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/demo/uikit/overlay'] },
                            { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/demo/uikit/media'] },
                            { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/demo/uikit/menu'] },
                            { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/demo/uikit/message'] },
                            { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/demo/uikit/file'] },
                            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/demo/uikit/charts'] },
                            { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/demo/uikit/timeline'] },
                            { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/demo/uikit/misc'] }
                        ]
                    },
                    {
                        label: 'Pages',
                        icon: 'pi pi-fw pi-briefcase',
                        path: '/pages',
                        items: [
                            {
                                label: 'Landing',
                                icon: 'pi pi-fw pi-globe',
                                routerLink: ['/demo/landing']
                            },
                            {
                                label: 'Auth',
                                icon: 'pi pi-fw pi-user',
                                items: [
                                    {
                                        label: 'Login',
                                        icon: 'pi pi-fw pi-sign-in',
                                        routerLink: ['/demo/auth/login']
                                    },
                                    {
                                        label: 'Error',
                                        icon: 'pi pi-fw pi-times-circle',
                                        routerLink: ['/demo/auth/error']
                                    },
                                    {
                                        label: 'Access Denied',
                                        icon: 'pi pi-fw pi-lock',
                                        routerLink: ['/demo/auth/access']
                                    }
                                ]
                            },
                            {
                                label: 'Crud',
                                icon: 'pi pi-fw pi-pencil',
                                routerLink: ['/demo/pages/crud']
                            },
                            {
                                label: 'Not Found',
                                icon: 'pi pi-fw pi-exclamation-circle',
                                routerLink: ['/demo/pages/notfound']
                            },
                            {
                                label: 'Empty',
                                icon: 'pi pi-fw pi-circle-off',
                                routerLink: ['/demo/pages/empty']
                            }
                        ]
                    },
                    // {
                    //     label: 'Hierarchy',
                    //     path: '/hierarchy',
                    //     items: [
                    //         {
                    //             label: 'Submenu 1',
                    //             icon: 'pi pi-fw pi-bookmark',
                    //             path: '/hierarchy/submenu_1',
                    //             items: [
                    //                 {
                    //                     label: 'Submenu 1.1',
                    //                     icon: 'pi pi-fw pi-bookmark',
                    //                     path: '/hierarchy/submenu_1/submenu_1_1',
                    //                     items: [
                    //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                    //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                    //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                    //                     ]
                    //                 },
                    //                 {
                    //                     label: 'Submenu 1.2',
                    //                     icon: 'pi pi-fw pi-bookmark',
                    //                     path: '/hierarchy/submenu_1/submenu_1_2',
                    //                     items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    //                 }
                    //             ]
                    //         },
                    //         {
                    //             label: 'Submenu 2',
                    //             icon: 'pi pi-fw pi-bookmark',
                    //             path: '/hierarchy/submenu_2',
                    //             items: [
                    //                 {
                    //                     label: 'Submenu 2.1',
                    //                     icon: 'pi pi-fw pi-bookmark',
                    //                     path: '/hierarchy/submenu_2/submenu_2_1',
                    //                     items: [
                    //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                    //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                    //                     ]
                    //                 },
                    //                 {
                    //                     label: 'Submenu 2.2',
                    //                     icon: 'pi pi-fw pi-bookmark',
                    //                     path: '/hierarchy/submenu_2/submenu_2_2',
                    //                     items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                    //                 }
                    //             ]
                    //         }
                    //     ]
                    // },
                ]
            }
        ];
    }
}
