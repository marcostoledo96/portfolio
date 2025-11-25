// DrawerService: controlo el estado del drawer móvil con un BehaviorSubject.
// Este servicio me permite abrir/cerrar el cajón desde cualquier componente
// y mantener el estado sincronizado.

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    private estadoDrawer = new BehaviorSubject<boolean>(false);
    public drawerAbierto$: Observable<boolean> = this.estadoDrawer.asObservable();

    constructor() { }

    // Obtengo el estado actual del drawer
    estaAbierto(): boolean {
        return this.estadoDrawer.value;
    }

    // Abro el drawer
    abrir(): void {
        this.estadoDrawer.next(true);
    }

    // Cierro el drawer
    cerrar(): void {
        this.estadoDrawer.next(false);
    }

    // Alterno el estado del drawer
    alternar(): void {
        this.estadoDrawer.next(!this.estadoDrawer.value);
    }
}
