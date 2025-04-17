import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showError(message: string): void {
    this.snackBar.open(message, 'Fechar', { 
      duration: 5000,
      panelClass: ['error-snackbar'] 
    });
  }
}