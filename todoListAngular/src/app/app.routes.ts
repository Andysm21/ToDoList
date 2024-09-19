import { Routes } from '@angular/router';
import { SignUpComponent } from './auth/signup/signup.component';
import { LogInComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthComponent,

  },
  {
    path:'signUp',
    component: SignUpComponent,
  },
  {
    path:'logIn',
    component: LogInComponent,
  },
  {
    path:'tasks',
    loadComponent: () => import('./task/tasks.component').then(module => module.TasksComponent),
    canActivate: [AuthGuard],
  }
];
