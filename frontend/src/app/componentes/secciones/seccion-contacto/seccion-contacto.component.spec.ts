// SeccionContactoComponent Tests: verifica validación de formulario, honeypot,
// estados de envío y lógica de getFieldStatus.
// Turnstile (CDN) se declara en window para evitar errores de referencia.

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { SeccionContactoComponent } from './seccion-contacto.component';
import { ApiService } from '../../../core/services/api.service';

// Mock de ApiService: simulo respuesta exitosa o fallida según la configuración
class ApiServiceMock {
  sendContactMessage = jasmine.createSpy('sendContactMessage').and.returnValue(
    of({ success: true, message: 'ok' }),
  );
}

describe('SeccionContactoComponent', () => {
  let fixture: ComponentFixture<SeccionContactoComponent>;
  let component: SeccionContactoComponent;
  let apiMock: ApiServiceMock;

  beforeEach(async () => {
    // Turnstile no existe en test; lo declaro como stub global para evitar ReferenceError
    (window as any)['turnstile'] = {
      render: jasmine.createSpy('render').and.returnValue('widget-id'),
      remove: jasmine.createSpy('remove'),
    };

    await TestBed.configureTestingModule({
      imports: [SeccionContactoComponent, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useClass: ApiServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(SeccionContactoComponent);
    component = fixture.componentInstance;
    apiMock   = TestBed.inject(ApiService) as unknown as ApiServiceMock;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as any)['turnstile'];
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('estado inicial del formulario', () => {
    it('formData comienza vacío', () => {
      expect(component.formData.name).toBe('');
      expect(component.formData.email).toBe('');
      expect(component.formData.message).toBe('');
    });

    it('no hay errores al iniciar', () => {
      expect(Object.keys(component.errors).length).toBe(0);
    });

    it('sending es false al iniciar', () => {
      expect(component.sending).toBeFalse();
    });

    it('sent es false al iniciar', () => {
      expect(component.sent).toBeFalse();
    });

    it('honeypotValue empieza vacío', () => {
      expect(component.honeypotValue).toBe('');
    });
  });

  describe('validación al enviar (onSubmit)', () => {
    it('muestra error de nombre cuando el campo está vacío', () => {
      component.onSubmit();
      expect((component.errors as any).name).toBeTruthy();
    });

    it('muestra error de email cuando el campo está vacío', () => {
      component.onSubmit();
      expect((component.errors as any).email).toBeTruthy();
    });

    it('muestra error de mensaje cuando el campo está vacío', () => {
      component.onSubmit();
      expect((component.errors as any).message).toBeTruthy();
    });

    it('muestra error de email cuando el formato es inválido', () => {
      component.formData.email = 'esto-no-es-email';
      component.onSubmit();
      expect((component.errors as any).email).toBeTruthy();
    });

    it('no muestra error de email con formato válido', () => {
      component.formData = {
        name: 'Marcos Toledo',
        email: 'marcos@ejemplo.com',
        message: 'Mensaje de prueba con más de diez chars',
      };
      component.onSubmit();
      expect((component.errors as any).email).toBeFalsy();
    });

    it('no llama a ApiService si hay errores de validación', () => {
      component.onSubmit(); // Formulario vacío
      expect(apiMock.sendContactMessage).not.toHaveBeenCalled();
    });
  });

  describe('honeypot', () => {
    it('bloquea el envío silenciosamente si honeypot tiene contenido', () => {
      component.formData = {
        name: 'Bot User',
        email: 'bot@spam.com',
        message: 'Mensaje automático de prueba',
      };
      component.honeypotValue  = 'soy un bot';
      component.turnstileToken = 'token-valido';
      component.onSubmit();
      expect(apiMock.sendContactMessage).not.toHaveBeenCalled();
    });
  });

  describe('bloqueo por CAPTCHA', () => {
    it('bloquea el envío si turnstileToken está vacío', () => {
      component.formData = {
        name: 'Usuario Real',
        email: 'real@ejemplo.com',
        message: 'Mensaje de prueba válido con suficientes caracteres',
      };
      component.turnstileToken = ''; // CAPTCHA no completado
      component.onSubmit();
      expect(apiMock.sendContactMessage).not.toHaveBeenCalled();
    });
  });

  describe('envío exitoso', () => {
    beforeEach(() => {
      component.formData = {
        name: 'Marcos Toledo',
        email: 'marcos@ejemplo.com',
        message: 'Mensaje de prueba con contenido válido',
      };
      component.turnstileToken = 'token-valido-cloudflare';
      apiMock.sendContactMessage.and.returnValue(of({ success: true, message: 'ok' }));
      component.onSubmit();
    });

    it('llama a ApiService.sendContactMessage', () => {
      expect(apiMock.sendContactMessage).toHaveBeenCalled();
    });

    it('resetea el formulario tras envío exitoso', () => {
      expect(component.formData.name).toBe('');
      expect(component.formData.email).toBe('');
      expect(component.formData.message).toBe('');
    });

    it('activa el estado sent = true', () => {
      expect(component.sent).toBeTrue();
    });

    it('stopping = false después del envío', () => {
      expect(component.sending).toBeFalse();
    });
  });

  describe('envío fallido', () => {
    beforeEach(() => {
      component.formData = {
        name: 'Marcos Toledo',
        email: 'marcos@ejemplo.com',
        message: 'Mensaje de prueba con contenido válido',
      };
      component.turnstileToken = 'token-valido-cloudflare';
      apiMock.sendContactMessage.and.returnValue(
        throwError(() => new Error('Error del servidor')),
      );
      component.onSubmit();
    });

    it('sending vuelve a false tras error', () => {
      expect(component.sending).toBeFalse();
    });

    it('sent permanece false tras error', () => {
      expect(component.sent).toBeFalse();
    });
  });

  describe('getFieldStatus', () => {
    it('retorna "idle" para campo no tocado y sin error', () => {
      expect(component.getFieldStatus('name')).toBe('idle');
    });

    it('retorna "invalid" cuando el campo fue tocado y está vacío', () => {
      component.touchedFields.add('name');
      expect(component.getFieldStatus('name')).toBe('invalid');
    });

    it('retorna "valid" cuando nombre tiene 2+ caracteres y fue tocado', () => {
      component.formData.name = 'MR';
      component.touchedFields.add('name');
      expect(component.getFieldStatus('name')).toBe('valid');
    });

    it('retorna "valid" cuando email es válido y fue tocado', () => {
      component.formData.email = 'test@test.com';
      component.touchedFields.add('email');
      expect(component.getFieldStatus('email')).toBe('valid');
    });

    it('retorna "invalid" cuando email no tiene @ y fue tocado', () => {
      component.formData.email = 'noatemail';
      component.touchedFields.add('email');
      expect(component.getFieldStatus('email')).toBe('invalid');
    });

    it('retorna "valid" cuando mensaje tiene 10+ caracteres y fue tocado', () => {
      component.formData.message = 'Hola mundo!';
      component.touchedFields.add('message');
      expect(component.getFieldStatus('message')).toBe('valid');
    });

    it('retorna "invalid" cuando mensaje tiene menos de 10 caracteres y fue tocado', () => {
      component.formData.message = 'corto';
      component.touchedFields.add('message');
      expect(component.getFieldStatus('message')).toBe('invalid');
    });
  });

  describe('clearError', () => {
    it('elimina el error del campo especificado', () => {
      component.errors = { name: 'Error', email: undefined, message: undefined };
      component.clearError('name');
      expect((component.errors as any).name).toBeUndefined();
    });

    it('no afecta otros errores al limpiar uno', () => {
      component.errors = { name: 'Error nombre', email: 'Error email', message: undefined };
      component.clearError('name');
      expect((component.errors as any).email).toBe('Error email');
    });
  });

  describe('mailtoHref', () => {
    it('construye la URL mailto sin exponer literalmente la dirección', () => {
      expect(component.mailtoHref).toContain('mailto:');
      expect(component.mailtoHref).toContain('@');
    });
  });
});
