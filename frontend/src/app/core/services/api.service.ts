// Servicio HTTP centralizado: todas las llamadas al backend pasan por acá.
// Uso HttpClient para las peticiones y configuro la URL base desde environment.
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Datos que el usuario completa en el formulario de contacto
export interface DatosContacto {
    name: string;
    email: string;
    message: string;
}

// Respuesta genérica del backend; T tipifica el campo data según el endpoint
export interface RespuestaApi<T = any> {
    success: boolean;
    message?: string;  // Mensaje descriptivo del backend (opcional)
    data?: T;          // Payload extra (tipo genérico T)
    errors?: string[]; // Lista de errores de validación (opcional)
}

@Injectable({
    providedIn: 'root', // Singleton global: una sola instancia en toda la app
})
export class ApiService {

    private urlApi = environment.apiUrl; // URL base tomada del entorno (dev / prod)

    constructor(private http: HttpClient) {}

    // Envío los datos del formulario al endpoint /contact mediante POST
    sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
        const url = `${this.urlApi}/contact`;
        const encabezados = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<RespuestaApi>(url, datos, { headers: encabezados })
            .pipe(catchError(this.manejarError)); // Centralizo el manejo de errores HTTP
    }

    // Manejo centralizado: distingo errores de red (cliente) de errores de servidor
    private manejarError(error: HttpErrorResponse): Observable<never> {
        let mensajeError = 'Ocurrió un error inesperado';

        if (error.error instanceof ErrorEvent) {
            mensajeError = `Error: ${error.error.message}`; // Error de red o CORS
        } else {
            // Uso el mensaje del backend si existe; sino construyo uno con el status HTTP
            mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }

        console.error('ApiService error:', mensajeError);
        return throwError(() => new Error(mensajeError));
    }
}
