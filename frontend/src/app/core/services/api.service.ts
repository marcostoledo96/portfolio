// ============================================================================
// ApiService: servicio para centralizar todas las llamadas HTTP al backend
// ============================================================================
// Centralizo todas las llamadas HTTP al backend.
// Uso HttpClient para las peticiones y configuro la URL base desde environment.
// Este servicio maneja errores de forma consistente y devuelve Observables.
// Por ahora solo tengo la llamada /api/contact para el formulario.

// === IMPORTS DE ANGULAR ===
import { Injectable } from '@angular/core';

// HttpClient: servicio de Angular para hacer peticiones HTTP (GET, POST, PUT, DELETE)
// Es como fetch() o axios, pero devuelve Observables en vez de Promesas
// HttpErrorResponse: tipo que representa un error HTTP (tiene status, statusText, error, etc.)
// HttpHeaders: clase para configurar headers HTTP (Content-Type, Authorization, etc.)
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

// === IMPORTS DE RXJS ===
// Observable: flujo de datos al que me puedo suscribir
// throwError: función que crea un Observable que emite un error
import { Observable, throwError } from 'rxjs';

// catchError: operador de RxJS para capturar y manejar errores
import { catchError } from 'rxjs/operators';

// === IMPORT DE CONFIGURACIÓN ===
// environment: objeto con variables de entorno (apiUrl, production, etc.)
// En desarrollo: apiUrl = 'http://localhost:4200/api'
// En producción: apiUrl = '/api'
import { environment } from '../../../environments/environment';

// === INTERFACES ===
// export: hace que la interfaz sea importable desde otros archivos
// interface: define la estructura de un objeto (qué propiedades tiene y de qué tipo)

// Interfaz para los datos del formulario de contacto
export interface DatosContacto {
    name: string;     // Nombre del usuario (debe ser string)
    email: string;    // Email del usuario (debe ser string)
    message: string;  // Mensaje del usuario (debe ser string)
}

// Interfaz para la respuesta del backend
// <T = any>: tipo genérico con valor por defecto 'any'
// Permite usar RespuestaApi<MiTipo> para especificar el tipo de 'data'
export interface RespuestaApi<T = any> {
    success: boolean;     // true = éxito, false = error
    message?: string;     // ? = opcional (puede existir o no)
    data?: T;             // Datos extra (tipo genérico T)
    errors?: string[];    // Array de mensajes de error (opcional)
}

// === DECORADOR @Injectable ===
@Injectable({
    // providedIn: 'root' = singleton global (una sola instancia en toda la app)
    providedIn: 'root'
})
export class ApiService {
    
    // === PROPIEDADES ===
    
    // URL base de la API
    // private: solo accesible dentro de esta clase
    // environment.apiUrl viene de environments/environment.ts
    private urlApi = environment.apiUrl;

    // === CONSTRUCTOR ===
    // Angular inyecta HttpClient automáticamente (Dependency Injection)
    // private http: crea una propiedad 'http' automáticamente
    constructor(private http: HttpClient) { }

    // === MÉTODO: ENVIAR MENSAJE DE CONTACTO ===
    // Envío un mensaje de contacto al backend
    // Parámetros:
    //   datos: DatosContacto = objeto con name, email, message
    // Retorna:
    //   Observable<RespuestaApi> = flujo de datos que emite la respuesta del backend
    sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
        // Construyo la URL completa
        // Template literal: `${variable}` = concatenación de strings
        // Ej: si urlApi = '/api', entonces url = '/api/contact'
        const url = `${this.urlApi}/contact`;
        
        // === CONFIGURACIÓN DE HEADERS ===
        // new HttpHeaders(): creo un objeto de headers HTTP
        // 'Content-Type': 'application/json' = le digo al servidor que envío JSON
        const encabezados = new HttpHeaders({ 'Content-Type': 'application/json' });

        // === PETICIÓN HTTP POST ===
        // this.http.post(): hace una petición POST al backend
        // <RespuestaApi>: tipo genérico (espero que la respuesta sea RespuestaApi)
        // Parámetros:
        //   1. url: dónde enviar la petición
        //   2. datos: qué enviar (body del POST)
        //   3. { headers: ... }: opciones extra (headers, params, etc.)
        return this.http.post<RespuestaApi>(url, datos, { headers: encabezados })
            // .pipe(): encadena operadores de RxJS
            .pipe(
                // catchError: captura errores HTTP y los maneja
                // this.manejarError: método privado que transforma el error
                catchError(this.manejarError)
                
                // Otros operadores comunes:
                // map(data => data.result)  // Transformar la respuesta
                // retry(3)                   // Reintentar 3 veces si falla
                // timeout(5000)              // Timeout de 5 segundos
            );
    }

    // === MÉTODO PRIVADO: MANEJO CENTRALIZADO DE ERRORES HTTP ===
    // Este método se ejecuta cuando una petición HTTP falla
    // Parámetros:
    //   error: HttpErrorResponse = objeto con info del error (status, statusText, error, etc.)
    // Retorna:
    //   Observable<never> = Observable que emite un error inmediatamente
    //   'never' = nunca emite un valor exitoso (solo errores)
    private manejarError(error: HttpErrorResponse): Observable<never> {
        // Variable para guardar el mensaje de error
        let mensajeError = 'Ocurrió un error inesperado';

        // === VERIFICO EL TIPO DE ERROR ===
        
        // instanceof: operador de JavaScript que verifica el tipo de un objeto
        // ErrorEvent = error del lado del cliente (sin conexión, CORS, etc.)
        if (error.error instanceof ErrorEvent) {
            // Error del lado del cliente (red, timeout, etc.)
            // Template literal: `${variable}` para concatenar strings
            mensajeError = `Error: ${error.error.message}`;
        } else {
            // Error del lado del servidor (status 400, 500, etc.)
            
            // Optional chaining (?.) : si error.error es null/undefined, devuelve undefined
            // Sin ?: error.error.message tiraría error si error.error es null
            // || : operador OR - si error.error?.message es undefined, uso el string de la derecha
            mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
            
            // Ejemplos:
            // - Status 404: "Error 404: Not Found"
            // - Status 500: "Error 500: Internal Server Error"
            // - Si el backend envía { message: "Email inválido" }, uso ese mensaje
        }

        // === LOG DEL ERROR EN CONSOLA ===
        // console.error: imprime en consola con estilo de error (rojo)
        // Útil para debugging (ver qué salió mal)
        console.error('ApiService error:', mensajeError);
        
        // === RETORNO UN OBSERVABLE QUE EMITE ERROR ===
        // throwError: función de RxJS que crea un Observable que emite un error
        // () => new Error(mensajeError): arrow function que crea un objeto Error
        // El componente que se suscriba recibirá este error en el bloque 'error: (err) => ...'
        return throwError(() => new Error(mensajeError));
    }
}
