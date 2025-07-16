import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then(m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'agenda',
    loadChildren: () => import('./pages/agenda/agenda.module').then(m => m.AgendaPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tareas',
    loadChildren: () => import('./pages/tareas/tareas.module').then(m => m.TareasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tarea-form',
    loadChildren: () => import('./pages/tarea-form/tarea-form.module').then(m => m.TareaFormPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tarea-form/:id',
    loadChildren: () => import('./pages/tarea-form/tarea-form.module').then(m => m.TareaFormPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'habitos',
    loadChildren: () => import('./pages/habitos/habitos.module').then(m => m.HabitosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'notas',
    loadChildren: () => import('./pages/notas/notas.module').then(m => m.NotasPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then(m => m.PerfilPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ubicacion',
    loadChildren: () => import('./pages/ubicacion/ubicacion.module').then(m => m.UbicacionPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
