import { Component, AfterViewInit, inject } from '@angular/core';
import * as L from 'leaflet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MapEvent {
  title: string;
  date: string;
  lat: number;
  lng: number;
  description?: string;
}

@Component({
  selector: 'app-map',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private map!: L.Map;
  
  // Informações do mapa
  currentZoom = 11;
  currentCenter = '-22.9687° S, -43.3895° W';

  ngAfterViewInit(): void {
    this.initMap();
    this.loadEvents();
    this.setupMapEvents();
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false // Desativa o controle de zoom padrão
    }).setView([-22.9687, -43.3895], this.currentZoom);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  private setupMapEvents(): void {
    this.map.on('zoomend', () => {
      this.currentZoom = this.map.getZoom();
    });

    this.map.on('moveend', () => {
      const center = this.map.getCenter();
      this.currentCenter = `${center.lat.toFixed(4)}° ${center.lat > 0 ? 'N' : 'S'}, ${center.lng.toFixed(4)}° ${center.lng > 0 ? 'E' : 'W'}`;
    });
  }

  private loadEvents(): void {
    try {
      const storedEvents = localStorage.getItem('events');
      const events: MapEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
      
      if (!events.length) {
        this.snackBar.open('Nenhum evento cadastrado ainda', 'OK', { duration: 3000 });
      }

      events.forEach(event => {
        if (this.isValidEvent(event)) {
          this.addEventMarker(event);
        }
      });
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      this.snackBar.open('Erro ao carregar eventos salvos', 'OK', { duration: 5000 });
    }
  }

  private isValidEvent(event: any): event is MapEvent {
    return (
      event.title &&
      event.date &&
      typeof event.lat === 'number' && 
      typeof event.lng === 'number'
    );
  }

  private addEventMarker(event: MapEvent): void {
    const marker = L.marker([event.lat, event.lng], {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
    }).addTo(this.map);

    marker.bindPopup(this.createPopupContent(event));
  }

  private createPopupContent(event: MapEvent): string {
    return `
      <div class="map-popup">
        <h3>${event.title}</h3>
        ${event.description ? `<p>${event.description}</p>` : ''}
        <small><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</small>
        <div class="coordinates">
          <small>Lat: ${event.lat.toFixed(6)}</small>
          <small>Lng: ${event.lng.toFixed(6)}</small>
        </div>
      </div>
    `;
  }

  // Controles do Mapa
  zoomIn(): void {
    this.map.zoomIn();
    this.snackBar.open('Zoom aumentado', '', { duration: 1000 });
  }

  zoomOut(): void {
    this.map.zoomOut();
    this.snackBar.open('Zoom diminuído', '', { duration: 1000 });
  }

  refreshMap(): void {
    this.map.setView([-22.9687, -43.3895], 12);
    this.snackBar.open('Mapa centralizado', '', { duration: 1000 });
  }

  // Navegação
  navigateToForm(): void {
    this.router.navigate(['/new-event']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
