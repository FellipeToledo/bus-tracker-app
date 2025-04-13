import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Event {
  id: string;
  title: string;
  date: string;
  lat: number;
  lng: number;
  description?: string;
}

const EVENT_DATA: Event[] = []

@Component({
  selector: 'app-event-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements AfterViewInit{
  displayedColumns: string[] = ['id', 'title', 'date', 'location', 'description', 'actions'];
  dataSource = new MatTableDataSource<Event>(EVENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.loadEvents();
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar

  ) {}

  loadEvents(): void {
    const storedEvents = localStorage.getItem('events');
    const events = storedEvents ? JSON.parse(storedEvents) : [];
    this.dataSource = new MatTableDataSource<Event>(events);
  }

  editEvent(eventId: string): void {
    this.router.navigate(['/events/edit', eventId]);
  }

  deleteEvent(eventId: string): void {
    const storedEvents = localStorage.getItem('events');
    let events = storedEvents ? JSON.parse(storedEvents) : [];

    // Filtra o evento a ser removido
    events = events.filter((event: Event) => event.id !== eventId);

    // Atualiza o localStorage
    localStorage.setItem('events', JSON.stringify(events));

    // Atualiza o dataSource
    this.dataSource.data = events;

    // Exibe uma mensagem de sucesso
    this.snackBar.open('Evento excluído com sucesso!', 'Fechar', {
      duration: 3000,
    });
  }


  navigateToForm(): void {
    this.router.navigate(['/events/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

}
