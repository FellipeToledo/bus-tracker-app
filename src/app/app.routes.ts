import { Routes } from '@angular/router';


export const routes: Routes = [
  
  { 
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Início - Mapa Interativo',
    data: {
      breadcrumb: 'Início'
    }
  },
  { 
    path: 'map',
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
    title: 'Mapa Interativo',
    data: {
      breadcrumb: 'Mapa'
    }
  },
  {
    path: 'events',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/event-list/event-list.component').then(m => m.EventListComponent),
        title: 'Lista de Eventos'
      },
      {
        path: 'new',
        loadComponent: () => import('./components/event-form/event-form.component').then(m => m.EventFormComponent),
        title: 'Novo Evento'
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./components/event-form/event-form.component').then(m => m.EventFormComponent),
        title: 'Editar Evento'
      }
    ]
  },
  { 
    path: '**',
    redirectTo: 'home'
  }
];
