import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Event {
  id: string;
  title: string;
  date: string;
  lat: number | null;
  lng: number | null;
  description?: string;
}

@Component({
  selector: 'app-event-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent {

  private router = inject(Router);
  
  event: Event = {
    id: '',
    title: '',
    date: '',
    lat: null,
    lng: null,
    description: ''
  };

  onSubmit() {
    const storedEvents = localStorage.getItem('events');
    const events: Event[] = storedEvents ? JSON.parse(storedEvents) : [];
    
    events.push({ ...this.event });
    localStorage.setItem('events', JSON.stringify(events));
    
    alert('Evento salvo com sucesso!');
    this.navigateToMap();
  }

  navigateToMap() {
    this.router.navigate(['/map']);
  }
  navigateBack() {
    this.router.navigate(['/']);
  }
}
