import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToForm() {
    this.router.navigate(['/events/new']);
  }

  navigateToMap() {
    this.router.navigate(['/map']);
  }

  navigateToEvents() {
    this.router.navigate(['/events']);
  }

}
