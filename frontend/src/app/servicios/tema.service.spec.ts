// TemaService Tests: verifica la lógica de theming, persistencia en localStorage y
// manipulación del classList del <html>. Cada test parte de un estado limpio.

import { TestBed } from '@angular/core/testing';
import { TemaService } from './tema.service';

describe('TemaService', () => {
  let service: TemaService;

  // Antes de cada test limpio localStorage y la clase 'dark' del <html>
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    TestBed.configureTestingModule({
      providers: [TemaService],
    });

    service = TestBed.inject(TemaService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('el tema por defecto es oscuro cuando no hay nada en localStorage', () => {
    // Sin entrada en localStorage el signal debe ser 'dark'
    expect(service.theme()).toBe('dark');
  });

  it('aplica la clase .dark al <html> al inicializar en modo oscuro', () => {
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });

  it('recupera el tema guardado en localStorage al inicializar', () => {
    // Pre-seteo localStorage ANTES de crear la instancia
    localStorage.setItem('portfolio-theme', 'light');
    document.documentElement.classList.remove('dark');

    // Creo una instancia nueva que lee el storage
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [TemaService] });
    const servicioConTemaClaro = TestBed.inject(TemaService);

    expect(servicioConTemaClaro.theme()).toBe('light');
  });

  it('toggleTheme alterna de dark a light', () => {
    expect(service.theme()).toBe('dark');
    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('toggleTheme alterna de light a dark', () => {
    localStorage.setItem('portfolio-theme', 'light');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [TemaService] });
    const svc = TestBed.inject(TemaService);

    svc.toggleTheme();
    expect(svc.theme()).toBe('dark');
  });

  it('persiste el tema en localStorage después del toggle', () => {
    service.toggleTheme(); // dark → light
    expect(localStorage.getItem('portfolio-theme')).toBe('light');
  });

  it('remueve la clase .dark del <html> al pasar a modo claro', () => {
    service.toggleTheme(); // dark → light
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });

  it('agrega la clase .dark al <html> al volver a modo oscuro', () => {
    service.toggleTheme(); // dark → light
    service.toggleTheme(); // light → dark
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });
});
