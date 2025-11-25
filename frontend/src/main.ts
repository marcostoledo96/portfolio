// Este es el punto de entrada de la aplicación Angular.
// Yo cargo aquí el módulo principal (AppModule) y arranco la plataforma del navegador.
// Angular usa esta función para inicializar toda la app y montar el AppComponent en el DOM.

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
    .bootstrapModule(AppModule, {
        ngZoneEventCoalescing: true
    })
    .catch(err => console.error(err));
