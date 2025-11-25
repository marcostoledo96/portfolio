// AppRoutingModule: configuro todas las rutas de la aplicación acá.
// Yo prefiero lazy-loading para los feature modules grandes (Portfolio, Contact) para
// mejorar el tiempo de carga inicial. Las rutas por defecto cargan HomeComponent.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'portfolio',
        // Redirijo a la raíz (Home) para mantener una sola página.
        // Antes este path cargaba lazy el `PortfolioModule`; como querés
        // una página única, lo redirijo para evitar imports obsoletos.
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

