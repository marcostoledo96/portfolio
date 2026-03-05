// Indicador de scroll reutilizable: botón SCROLL + chevron animado al pie de cada sección.
// Al hacer clic desplaza suavemente hasta la sección indicada por `targetId`.
import { Component, Input, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const lucide: any;

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-indicator.component.html',
  styleUrls: ['./scroll-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollIndicatorComponent implements AfterViewInit {
  /** ID del elemento destino al que debe desplazarse */
  @Input() targetId = '';
  /** Texto visible (por defecto "SCROLL") */
  @Input() label = 'SCROLL';

  // Secciones que se alinean al centro de la ventana (igual que handleNavClick en app.component.ts)
  private readonly centerSections = ['idiomas', 'contacto', 'sobre-mi'];

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  scrollToTarget(): void {
    const block = this.centerSections.includes(this.targetId) ? 'center' : 'start';
    const el = document.getElementById(this.targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block });
    // Segundo scroll correctivo por si secciones lazy aún no terminaron de cargar
    setTimeout(() => {
      document.getElementById(this.targetId)?.scrollIntoView({ behavior: 'smooth', block });
    }, 350);
  }
}
