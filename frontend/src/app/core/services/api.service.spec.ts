// ApiService Tests: pruebas unitarias para verificar las llamadas HTTP al backend.
// Testeo que el servicio envie correctamente los mensajes de contacto y maneje errores.
// Uso HttpClientTestingModule para simular las respuestas del servidor.

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, DatosContacto, RespuestaApi } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
    let service: ApiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiService]
        });
        
        service = TestBed.inject(ApiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Verifico que no queden peticiones pendientes
        httpMock.verify();
    });

    it('deberia crearse correctamente', () => {
        expect(service).toBeTruthy();
    });

    describe('sendContactMessage', () => {
        const datosContacto: DatosContacto = {
            name: 'Juan Perez',
            email: 'juan@ejemplo.com',
            message: 'Hola, me interesa tu portfolio!'
        };

        it('deberia enviar el mensaje de contacto correctamente', () => {
            const respuestaEsperada: RespuestaApi = {
                success: true,
                message: 'Mensaje enviado con exito'
            };

            service.sendContactMessage(datosContacto).subscribe(respuesta => {
                expect(respuesta.success).toBeTrue();
                expect(respuesta.message).toBe('Mensaje enviado con exito');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
            expect(req.request.method).toBe('POST');
            expect(req.request.headers.get('Content-Type')).toBe('application/json');
            expect(req.request.body).toEqual(datosContacto);
            
            req.flush(respuestaEsperada);
        });

        it('deberia manejar errores del servidor (500)', () => {
            service.sendContactMessage(datosContacto).subscribe({
                next: () => fail('Deberia haber fallado'),
                error: (error) => {
                    expect(error).toBeTruthy();
                    expect(error.message).toContain('Error');
                }
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
            req.flush(
                { message: 'Error interno del servidor' },
                { status: 500, statusText: 'Internal Server Error' }
            );
        });

        it('deberia manejar errores de red', () => {
            service.sendContactMessage(datosContacto).subscribe({
                next: () => fail('Deberia haber fallado'),
                error: (error) => {
                    expect(error).toBeTruthy();
                }
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
            req.error(new ProgressEvent('error'));
        });

        it('deberia enviar los datos con el formato correcto', () => {
            service.sendContactMessage(datosContacto).subscribe();

            const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
            
            // Verifico que los datos del body sean correctos
            expect(req.request.body.name).toBe('Juan Perez');
            expect(req.request.body.email).toBe('juan@ejemplo.com');
            expect(req.request.body.message).toBe('Hola, me interesa tu portfolio!');
            
            req.flush({ success: true });
        });

        it('deberia manejar respuestas con success false', () => {
            const respuestaError: RespuestaApi = {
                success: false,
                message: 'Datos invalidos'
            };

            service.sendContactMessage(datosContacto).subscribe(respuesta => {
                expect(respuesta.success).toBeFalse();
                expect(respuesta.message).toBe('Datos invalidos');
            });

            const req = httpMock.expectOne(`${environment.apiUrl}/contact`);
            req.flush(respuestaError);
        });
    });
});
