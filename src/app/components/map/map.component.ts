import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MapEvent {
  id: string;
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
  private map!: L.Map;
  private eventMarkers: L.Marker[] = [];

  currentZoom = 11;
  currentCenter = '-22.9687° S, -43.3895° W';
 
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {

  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadAndDisplayEvents();
    this.setupMapEvents();
    
  }

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false, // Desativa o controle de zoom padrão
      preferCanvas: true // Melhora performance com muitos marcadores
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

  private loadAndDisplayEvents(): void {
    this.clearExistingMarkers();
    
    try {
      const events = this.getEventsFromStorage();
      
      if (events.length === 0) {
        this.snackBar.open('Nenhum evento cadastrado. Clique no botão "+" para adicionar.', 'OK', { duration: 3000 });
        return;
      }

      events.forEach(event => this.addEventMarker(event));
      
      
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      this.snackBar.open('Erro ao carregar eventos salvos', 'Fechar', { duration: 5000 });
    }
  }

  private getEventsFromStorage(): MapEvent[] {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  }

  private clearExistingMarkers(): void {
    this.eventMarkers.forEach(marker => marker.remove());
    this.eventMarkers = [];
  }

  private addEventMarker(event: MapEvent): void {
    const marker = L.marker([event.lat, event.lng], {
      icon: L.icon({
        iconUrl: 'img/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -32]
      })
    }).addTo(this.map);

    marker.bindPopup(this.createPopupContent(event));
    this.eventMarkers.push(marker);
  }

  private createPopupContent(event: MapEvent): string {
    return `
      <div class="map-popup">
        <h3>${event.title}</h3>
        <small><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</small>
        ${event.description ? `<p class="popup-description">${event.description}</p>` : ''}
        <div class="popup-actions">
          <button class="popup-btn" onclick="event.stopPropagation(); navigator.clipboard.writeText('${event.lat},${event.lng}')">
            Copiar coordenadas
          </button>
        </div>
      </div>
    `;
  }

  

  // Controles do Mapa
  zoomIn(): void {
    this.map.zoomIn();
    
  }

  zoomOut(): void {
    this.map.zoomOut();
    
  }

  refreshMap(): void {
    this.map.setView([-22.9687, -43.3895], 12);
    this.snackBar.open('Mapa centralizado', '', { duration: 1000 });
  }

  // Navegação
  navigateToForm(): void {
    this.router.navigate(['/events/new']);
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }
}
