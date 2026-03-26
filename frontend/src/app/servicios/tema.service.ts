// Servicio de tema: persiste la preferencia light/dark en localStorage y la aplica al <html>.
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' }) // Singleton global
export class TemaService {
  private readonly STORAGE_KEY = 'portfolio-theme'; // Clave usada para persistir el tema
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly doc = inject(DOCUMENT);

  // Signal reactivo: los componentes que lo lean se actualizan automáticamente al cambiar el tema
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme()); // Aplico el tema guardado al iniciar la app
  }

  // Alterna entre light y dark, persiste el nuevo valor y lo aplica al DOM
  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.applyTheme(next);
  }

  // Si hay un tema guardado lo uso; si no, arranco en dark por defecto
  private getInitialTheme(): Theme {
    if (!this.isBrowser) return 'dark'; // Sin localStorage durante prerendering
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    return stored ?? 'dark';
  }

  // Agrego o quito la clase 'dark' en <html> y persisto la elección en localStorage
  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return; // Sin DOM durante prerendering
    const root = this.doc.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
