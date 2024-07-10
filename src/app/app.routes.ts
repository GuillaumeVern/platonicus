import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/body/login/login.component';
import { ErrorComponent } from './components/body/error/error.component';
import { RegisterComponent } from './components/body/register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', component: MainPageComponent, pathMatch: 'full', canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', component: ErrorComponent },
];
