// theme.service.spec.ts — Tests para verificar que el servicio de temas funcione bien.
// Acá pruebo que cambie entre claro y oscuro, guarde en localStorage y actualice las clases CSS.

import { TestBed } from '@angular/core/testing';
import { skip, take } from 'rxjs/operators';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
    let servicio: ThemeService;
    let almacenamientoFalso: { [clave: string]: string } = {};

    beforeEach(() => {
        // Creo un mock de localStorage para que no toque el navegador real
        spyOn(localStorage, 'getItem').and.callFake((clave: string) => {
            return almacenamientoFalso[clave] || null;
        });
        spyOn(localStorage, 'setItem').and.callFake((clave: string, valor: string) => {
            almacenamientoFalso[clave] = valor;
        });
        spyOn(localStorage, 'removeItem').and.callFake((clave: string) => {
            delete almacenamientoFalso[clave];
        });

        TestBed.configureTestingModule({});
        servicio = TestBed.inject(ThemeService);
    });

    afterEach(() => {
        // Limpio todo después de cada test
        almacenamientoFalso = {};
        document.body.classList.remove('claro', 'oscuro');
        document.documentElement.classList.remove('claro', 'oscuro');
    });

    it('debe crearse correctamente', () => {
        expect(servicio).toBeTruthy();
    });

    it('debe inicializar con tema oscuro por defecto si no hay nada guardado', () => {
        const temaActual = servicio.obtenerTemaActual();
        expect(temaActual).toBe('oscuro');
    });

    it('debe inicializar con el tema guardado en localStorage si existe', () => {
        almacenamientoFalso['tema'] = 'claro';
        // Creo una nueva instancia para que lea el localStorage mockeado
        servicio = new ThemeService(document);
        const temaActual = servicio.obtenerTemaActual();
        expect(temaActual).toBe('claro');
    });

    it('debe cambiar de oscuro a claro al alternar', () => {
        servicio.establecerTema('oscuro');
        servicio.alternarTema();
        const temaActual = servicio.obtenerTemaActual();
        expect(temaActual).toBe('claro');
    });

    it('debe cambiar de claro a oscuro al alternar', () => {
        servicio.establecerTema('claro');
        servicio.alternarTema();
        const temaActual = servicio.obtenerTemaActual();
        expect(temaActual).toBe('oscuro');
    });

    it('debe guardar el tema en localStorage al establecerlo', () => {
        servicio.establecerTema('claro');
        expect(localStorage.setItem).toHaveBeenCalledWith('tema', 'claro');
    });

    it('debe emitir el nuevo tema a través del Observable tema$', (done) => {
        servicio.tema$
            .pipe(skip(1), take(1))
            .subscribe((tema: Theme) => {
                expect(tema).toBe('claro');
                done();
            });
        servicio.establecerTema('claro');
    });

    it('debe agregar la clase "claro" a body y html cuando el tema es claro', () => {
        servicio.establecerTema('claro');
        expect(document.body.classList.contains('claro')).toBe(true);
        expect(document.documentElement.classList.contains('claro')).toBe(true);
    });

    it('debe quitar la clase "claro" de body y html cuando el tema es oscuro', () => {
        servicio.establecerTema('claro');
        servicio.establecerTema('oscuro');
        expect(document.body.classList.contains('claro')).toBe(false);
        expect(document.documentElement.classList.contains('claro')).toBe(false);
    });

    it('debe mantener el tema al recargar la página', () => {
        servicio.establecerTema('claro');
        expect(almacenamientoFalso['tema']).toBe('claro');
        // Simulo un reload creando una nueva instancia del servicio
        const servicioNuevo = new ThemeService(document);
        expect(servicioNuevo.obtenerTemaActual()).toBe('claro');
    });
});

