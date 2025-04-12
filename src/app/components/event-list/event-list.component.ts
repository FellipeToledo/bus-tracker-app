import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';

interface MapEvent {
  id: string;
  title: string;
  date: string;
  lat: number;
  lng: number;
  description?: string;
}

@Component({
  selector: 'app-event-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit{

  displayedColumns: string[] = ['title', 'date', 'location', 'actions'];
  dataSource: MapEvent[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    this.dataSource = storedEvents ? JSON.parse(storedEvents) : [];
  }

  editEvent(event: MapEvent): void {
    this.router.navigate(['/events/edit', event.id]);
  }

  deleteEvent(event: MapEvent): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja realmente excluir o evento "${event.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(event.id);
      }
    });
  }

  private performDelete(eventId: string): void {
   // 1. Filtra os eventos, removendo apenas o evento com o ID correspondente
  const updatedEvents = this.dataSource.filter(e => e.id !== eventId);
  
  // 2. Atualiza o localStorage
  localStorage.setItem('events', JSON.stringify(updatedEvents));
  
  // 3. Atualiza o dataSource para refletir a mudança na tabela
  this.dataSource = [...updatedEvents]; // Usando spread para garantir imutabilidade

  this.snackBar.open('Evento excluído com sucesso!', 'Fechar', {
    duration: 3000
  });
  }

  viewOnMap(lat: number, lng: number): void {
    this.router.navigate(['/map'], {
      queryParams: { lat, lng, zoom: 15 }
    });
  }

  navigateToForm(): void {
    this.router.navigate(['/events/new']);
  }

    navigateBack(): void {
    this.router.navigate(['/']);
  }

}
