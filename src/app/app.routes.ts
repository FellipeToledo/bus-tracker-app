import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EventFormComponent } from './components/event-form/event-form.component';

export const routes: Routes = [
  
  { 
    path: '', 
    component: HomeComponent,
    title: 'Início'
  },
  { 
    path: 'map', 
    loadComponent: () => import('./components/map/map.component').then(m => m.MapComponent),
    title: 'Mapa'
  },
  { 
    path: 'new-event', 
    component: EventFormComponent,
    title: 'Cadastrar Evento' 
  }
];
