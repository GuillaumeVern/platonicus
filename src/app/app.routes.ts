import { Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginComponent } from './components/body/login/login.component';
import { ErrorComponent } from './components/body/error/error.component';
import { RegisterComponent } from './components/body/register/register.component';
import { authGuard } from './auth.guard';
import { ProfileComponent } from './components/body/profile/profile.component';
import { LeaderboardComponent } from './components/body/leaderboard/leaderboard.component';
import { SettingsComponent } from './components/body/settings/settings.component';

export const routes: Routes = [
    { path: 'home', component: MainPageComponent, pathMatch: 'full', canActivate: [authGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'leaderboard', component: LeaderboardComponent, canActivate: [authGuard] },
    { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: '**', component: ErrorComponent },
];
