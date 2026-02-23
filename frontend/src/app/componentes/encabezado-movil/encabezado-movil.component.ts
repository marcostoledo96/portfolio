// Encabezado visible solo en mobile: barra superior fija + drawer lateral deslizable.
// El padre controla si el drawer está abierto y qué sección está activa.

import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarraLateralComponent } from '../barra-lateral/barra-lateral.component'; // Reutilizo la sidebar dentro del drawer

declare const lucide: any; // Librería de íconos cargada desde CDN

// OnPush: solo re-renderiza cuando cambia algún @Input()
@Component({
  selector: 'app-encabezado-movil',
  standalone: true,
  imports: [CommonModule, BarraLateralComponent],
  templateUrl: './encabezado-movil.component.html',
  styleUrls: ['./encabezado-movil.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncabezadoMovilComponent implements AfterViewInit {
  @Input() isDrawerOpen = false;        // true = drawer visible, false = oculto
  @Input() activeSection = 'sobre-mi'; // Sección activa, se pasa a la sidebar interna
  @Output() toggleDrawer = new EventEmitter<void>(); // Abre/cierra el drawer
  @Output() navClick = new EventEmitter<string>();   // Reenvía el clic de navegación al padre

  // Inicializo Lucide cuando la vista está lista (los <i data-lucide> ya existen en el DOM)
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // Emite el toggle al padre para que invierta el estado del drawer
  onToggle(): void {
    this.toggleDrawer.emit();
  }

  // Al navegar, reenvía el ID al padre y cierra el drawer si estaba abierto
  onNavClick(id: string): void {
    this.navClick.emit(id);
    if (this.isDrawerOpen) {
      this.toggleDrawer.emit();
    }
  }
}
