// Punto de entrada del servidor — usado por Angular durante el build para generar HTML estático (prerendering).
// No se ejecuta en producción: solo durante `ng build` con prerender habilitado.
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { provideServerRendering } from '@angular/platform-server';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

// Angular 20 requiere que el bootstrap reciba un BootstrapContext del prerenderer
// y lo pase como tercer argumento a bootstrapApplication.
const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideServerRendering(),   // Habilita el rendering en Node.js (sin DOM real)
      provideNoopAnimations(),    // Desactiva animaciones durante el prerender (no hay viewport)
      provideHttpClient(),        // Requerido por ApiService
      provideRouter([]),          // Router vacío: el prerenderer necesita Router para navegar a '/'
    ],
  }, context);

export default bootstrap;
