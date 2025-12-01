// AppModule: módulo raíz de la aplicación.
// Acá declaro todos los módulos que uso, importo BrowserModule para correr en el navegador,
// configuro HttpClient para llamadas a la API y cargo AppRoutingModule para el manejo de rutas.
// Declaro todo aquí para que la arquitectura sea más simple (sin módulos intermedios).

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IMAGE_CONFIG } from '@angular/common';
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
    providers: [
        // Desactivo el warning de imágenes sobredimensionadas porque las muestro
        // en tamaño pequeño a propósito (iconos de habilidades técnicas)
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

