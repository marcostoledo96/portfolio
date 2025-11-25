// ThemeService: acá manejo el cambio entre modo claro y oscuro.
// Guardo la preferencia en localStorage para que persista entre sesiones.
// Cuando cambio el tema, actualizo las clases en <body> y <html>.

import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

export type Theme = 'claro' | 'oscuro';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly CLAVE_TEMA = 'tema';
    private temaActual: BehaviorSubject<Theme>;
    public tema$: Observable<Theme>;

    constructor(@Inject(DOCUMENT) private document: Document) {
        // Leo el tema guardado, o uso oscuro por defecto
        const temaGuardado = (localStorage.getItem(this.CLAVE_TEMA) as Theme) || 'oscuro';
        this.temaActual = new BehaviorSubject<Theme>(temaGuardado);
        this.tema$ = this.temaActual.asObservable();

        // Aplico el tema desde el inicio
        this.aplicarTema(temaGuardado);
    }

    // Devuelvo el tema actual (claro u oscuro)
    obtenerTemaActual(): Theme {
        return this.temaActual.value;
    }

    // Cambio entre claro y oscuro
    alternarTema(): void {
        const nuevoTema: Theme = this.temaActual.value === 'claro' ? 'oscuro' : 'claro';
        this.establecerTema(nuevoTema);
    }

    // Fuerzo un tema específico
    establecerTema(tema: Theme): void {
        this.temaActual.next(tema);
        this.aplicarTema(tema);
        localStorage.setItem(this.CLAVE_TEMA, tema);
    }

    // Agrego o quito la clase 'claro' en body y html
    private aplicarTema(tema: Theme): void {
        const body = this.document.body;
        const html = this.document.documentElement;

        if (tema === 'claro') {
            body.classList.add('claro');
            html.classList.add('claro');
        } else {
            body.classList.remove('claro');
            html.classList.remove('claro');
        }
    }
}
