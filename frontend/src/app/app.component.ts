// AppComponent: componente raíz que monta toda la aplicación.
// Este componente simplemente contiene la estructura de layout (sidebar, header móvil, drawer)
// y el router-outlet donde se cargan los distintos módulos de features según la ruta activa.
// Yo inicio Lucide icons cuando el componente está listo para que se rendericen correctamente.

import { Component, OnInit } from '@angular/core';

declare const lucide: any;

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Portfolio - Marcos Ezequiel Toledo';

    ngOnInit(): void {
        // Inicializo los iconos de Lucide apenas carga el componente raíz
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}
