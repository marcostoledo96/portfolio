// AppModule: módulo raíz de la aplicación.
// Acá declaro todos los módulos que uso, importo BrowserModule para correr en el navegador,
// configuro HttpClient para llamadas a la API y cargo AppRoutingModule para el manejo de rutas.
// Declar? todo aqu? para que la arquitectura sea m?s simple (sin m?dulos intermedios).

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MobileHeaderComponent } from './core/layout/mobile-header/mobile-header.component';
import { DrawerComponent } from './core/layout/drawer/drawer.component';
import { HomeComponent } from './features/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        MobileHeaderComponent,
        DrawerComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

