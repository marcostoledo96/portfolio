// NotificationService: manejo notificaciones tipo toast con un BehaviorSubject.
// Uso este servicio para mostrar mensajes de éxito o error al usuario.
// Los componentes pueden suscribirse a notificaciones$ y renderizar los toasts.

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private listaNotificaciones = new BehaviorSubject<Notificacion[]>([]);
    public notificaciones$: Observable<Notificacion[]> = this.listaNotificaciones.asObservable();
    private proximoId = 1;

    constructor() { }

    // Muestro una notificación de éxito
    showSuccess(mensaje: string): void {
        this.agregarNotificacion(mensaje, 'success');
    }

    // Muestro una notificación de error
    showError(mensaje: string): void {
        this.agregarNotificacion(mensaje, 'error');
    }

    // Muestro una notificación informativa
    showInfo(mensaje: string): void {
        this.agregarNotificacion(mensaje, 'info');
    }

    // Agrego una notificación y la elimino automáticamente después de 5 segundos
    private agregarNotificacion(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
        const notificacion: Notificacion = {
            message: mensaje,
            type: tipo,
            id: this.proximoId++
        };

        const actual = this.listaNotificaciones.value;
        this.listaNotificaciones.next([...actual, notificacion]);

        // Elimino la notificación después de 5 segundos
        setTimeout(() => {
            this.eliminarNotificacion(notificacion.id);
        }, 5000);
    }

    // Elimino una notificación específica por ID
    eliminarNotificacion(id: number): void {
        const actual = this.listaNotificaciones.value;
        this.listaNotificaciones.next(actual.filter(n => n.id !== id));
    }
}

