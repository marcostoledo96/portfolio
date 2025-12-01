// DrawerService Tests: pruebas unitarias para verificar el comportamiento del servicio
// que controla el estado del drawer (menu deslizable) en mobile.
// Testeo que el drawer se abra, cierre y alterne correctamente.

import { TestBed } from '@angular/core/testing';
import { DrawerService } from './drawer.service';

describe('DrawerService', () => {
    let service: DrawerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawerService);
    });

    it('deberia crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    it('deberia iniciar con el drawer cerrado', () => {
        expect(service.estaAbierto()).toBeFalse();
    });

    it('deberia abrir el drawer cuando llamo a abrir()', () => {
        service.abrir();
        expect(service.estaAbierto()).toBeTrue();
    });

    it('deberia cerrar el drawer cuando llamo a cerrar()', () => {
        // Primero abro el drawer
        service.abrir();
        expect(service.estaAbierto()).toBeTrue();
        
        // Ahora lo cierro
        service.cerrar();
        expect(service.estaAbierto()).toBeFalse();
    });

    it('deberia alternar el estado del drawer cuando llamo a alternar()', () => {
        // Inicio cerrado
        expect(service.estaAbierto()).toBeFalse();
        
        // Alterno -> deberia abrirse
        service.alternar();
        expect(service.estaAbierto()).toBeTrue();
        
        // Alterno de nuevo -> deberia cerrarse
        service.alternar();
        expect(service.estaAbierto()).toBeFalse();
    });

    it('deberia emitir el estado correcto a traves del observable drawerAbierto$', (done) => {
        const estados: boolean[] = [];
        
        service.drawerAbierto$.subscribe(estado => {
            estados.push(estado);
            
            // Despues de 3 emisiones verifico la secuencia
            if (estados.length === 3) {
                expect(estados).toEqual([false, true, false]);
                done();
            }
        });
        
        // Genero las emisiones
        service.abrir();
        service.cerrar();
    });
});
