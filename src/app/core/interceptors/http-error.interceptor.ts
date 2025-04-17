import { HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { catchError, throwError } from 'rxjs';

export function httpErrorInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMsg = error.error?.message || 'Erro desconhecido';
      notificationService.showError(errorMsg);
      return throwError(() => error);
    })
  );
}