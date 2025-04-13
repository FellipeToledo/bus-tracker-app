import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';

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
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon
  ],
  templateUrl: './event-form.component.html',
  styleUrl: './event-form.component.scss'
})
export class EventFormComponent implements OnInit {
  
  event: Event = {
    id: '',
    title: '',
    date: '',
    lat: null,
    lng: null,
    description: ''
  };
  isEditMode = false;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.isEditMode = true;
      this.loadEvent(eventId);
    } else {
      this.event.id = this.generateId();
    }
  }

  loadEvent(eventId: string): void {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventToEdit = events.find((e: Event) => e.id === eventId);
    if (eventToEdit) {
      this.event = { ...eventToEdit };
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  onSubmit() {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    if (this.isEditMode) {
      // Atualiza o evento existente
      const index = events.findIndex((e: Event) => e.id === this.event.id);
      if (index !== -1) {
        events[index] = { ...this.event };
      }
    } else {
      // Adiciona novo evento
      events.push({ ...this.event });
    }

    localStorage.setItem('events', JSON.stringify(events));
    
    const message = this.isEditMode 
      ? 'Evento atualizado com sucesso!' 
      : 'Evento salvo com sucesso!';
    
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
    this.router.navigate(['/events']);
  }
  
  navigateBack() {
    this.router.navigate(['/']);
  }
}
