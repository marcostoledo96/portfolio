// Punto de entrada de la aplicación — arranque standalone (sin NgModule).
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(), // habilita BrowserAnimationsModule globalmente para transiciones Angular
    provideHttpClient(), // requerido por ApiService para realizar llamadas HTTP
  ],
}).then(() => {
  // Pausa animaciones de fondo en secciones fuera de pantalla para reducir carga de GPU.
  // Agrega/quita la clase 'section-in-view' en cada <section id="..."> según su visibilidad.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        e.target.classList.toggle('section-in-view', e.isIntersecting);
      }
    },
    { rootMargin: '20% 0px' } // activa la clase 20% antes de que la sección entre al viewport
  );
  document.querySelectorAll('section[id]').forEach(s => io.observe(s)); // observa todas las secciones con id
}).catch(err => console.error(err));
