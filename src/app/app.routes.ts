import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    {
        path: 'home',
        component: MainPageComponent
    },
    {
        path: 'login',
        component: LoginComponent   
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
