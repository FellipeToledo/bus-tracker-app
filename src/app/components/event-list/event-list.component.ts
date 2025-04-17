import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EventService } from '../../services/event.service';

export interface Event {
  id: string;
  description: string;
  neighborhood: string;
  severity: string;
  status: string;
  roadblocks: Roadblock[];
}

export interface Roadblock {
  road: string;
  startRoad: string;
  endRoad: string;
  startDateTime: string;
  endDateTime: string;
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
  displayedColumns: string[] = ['id', 'description', 'severity', 'status', 'actions'];
  dataSource = new MatTableDataSource<Event>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.loadEvents();
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private eventService: EventService,

  ) {}

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        this.dataSource.data = events;
      },
      error: (err) => {
        console.error('Erro ao carregar eventos:', err);
        this.snackBar.open('Erro ao carregar eventos', 'Fechar', { duration: 3000 });
      }
    });
  }

  viewOnMap(event: Event): void {
    // TO DO 
    // Implementar navegação para o mapa com coordenadas
    console.log('Visualizar no mapa:', event);
  }


  editEvent(eventId: string): void {
    this.router.navigate(['/events/edit', eventId]);
  }

  
  navigateToForm(): void {
    this.router.navigate(['/events/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

}
