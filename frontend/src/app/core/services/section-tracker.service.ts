// SectionTrackerService: centraliza la sección activa que detectan sidebar y drawer.
// Así evito que cada componente se desincronice y mantengo un único estado fuente.

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SectionTrackerService {
    private seccionActiva$ = new BehaviorSubject<string>('sobre-mi');

    get seccionActiva(): Observable<string> {
        return this.seccionActiva$.asObservable();
    }

    setSeccionActiva(id: string): void {
        if (!id || this.seccionActiva$.value === id) {
            return;
        }
        this.seccionActiva$.next(id);
    }
}
