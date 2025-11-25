// MobileHeaderComponent: encabezado compacto para mobile con logo y botones de tema y drawer.
// Yo muestro este header solo en pantallas pequeñas (< 1024px).
// Los botones permiten alternar el tema y abrir/cerrar el drawer.

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { DrawerService } from '../../services/drawer.service';

declare const lucide: any;

@Component({
    selector: 'app-mobile-header',
    standalone: false,
    templateUrl: './mobile-header.component.html',
    styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
    temaActual: Theme = 'claro';
    drawerAbierto = false;
    private destroy$ = new Subject<void>();

    constructor(
        private themeService: ThemeService,
        private drawerService: DrawerService
    ) { }

    ngOnInit(): void {
        // Me suscribo al tema actual
        this.themeService.tema$
            .pipe(takeUntil(this.destroy$))
            .subscribe((theme: Theme) => {
                this.temaActual = theme;
                if (typeof lucide !== 'undefined') {
                    setTimeout(() => lucide.createIcons(), 0);
                }
            });

        // Me suscribo al estado del drawer
        this.drawerService.drawerAbierto$
            .pipe(takeUntil(this.destroy$))
            .subscribe((abierto: boolean) => {
                this.drawerAbierto = abierto;
                if (typeof lucide !== 'undefined') {
                    setTimeout(() => lucide.createIcons(), 0);
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // Alterno el tema
    alternarTema(): void {
        this.themeService.alternarTema();
    }

    // Alterno el drawer
    alternarDrawer(): void {
        this.drawerService.alternar();
    }
}
