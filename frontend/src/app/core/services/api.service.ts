// ApiService: centralizo todas las llamadas HTTP al backend.
// Uso HttpClient para las peticiones y configuro la URL base desde environment.
// Este servicio maneja errores de forma consistente y devuelve Observables.
// Por ahora solo tengo la llamada /api/contact para el formulario.

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DatosContacto {
    name: string;
    email: string;
    message: string;
}

export interface RespuestaApi<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: string[];
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private urlApi = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Envío un mensaje de contacto al backend
    sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
        const url = `${this.urlApi}/contact`;
        const encabezados = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this.http.post<RespuestaApi>(url, datos, { headers: encabezados })
            .pipe(
                catchError(this.manejarError)
            );
    }

    // Health check para verificar que el backend está disponible
    // Manejo centralizado de errores HTTP
    private manejarError(error: HttpErrorResponse): Observable<never> {
        let mensajeError = 'Ocurrió un error inesperado';

        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente
            mensajeError = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor
            mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }

        console.error('ApiService error:', mensajeError);
        return throwError(() => new Error(mensajeError));
    }
}
