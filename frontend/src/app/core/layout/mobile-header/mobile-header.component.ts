// MobileHeaderComponent: encabezado compacto para mobile con logo y botones de tema y drawer.
// Yo muestro este header solo en pantallas pequeñas (< 1024px).
// Los botones permiten alternar el tema y abrir/cerrar el drawer.

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { DrawerService } from '../../services/drawer.service';

declare const lucide: any;

type IdleCb = (cb: () => void) => void;

@Component({
    selector: 'app-mobile-header',
    standalone: false,
    templateUrl: './mobile-header.component.html',
    styleUrls: ['./mobile-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileHeaderComponent implements OnInit, OnDestroy {
    temaActual: Theme = 'claro';
    drawerAbierto = false;
    private destroy$ = new Subject<void>();
    private iconosPendientes = false;

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
                this.programarIconos();
            });

        // Me suscribo al estado del drawer
        this.drawerService.drawerAbierto$
            .pipe(takeUntil(this.destroy$))
            .subscribe((abierto: boolean) => {
                this.drawerAbierto = abierto;
                this.programarIconos();
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private programarIconos(): void {
        if (this.iconosPendientes || typeof lucide === 'undefined') {
            return;
        }
        this.iconosPendientes = true;
        const renderizar = () => {
            lucide.createIcons();
            this.iconosPendientes = false;
        };
        const idle = (window as any).requestIdleCallback as IdleCb;
        if (idle) {
            idle(renderizar);
        } else {
            setTimeout(renderizar, 0);
        }
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
