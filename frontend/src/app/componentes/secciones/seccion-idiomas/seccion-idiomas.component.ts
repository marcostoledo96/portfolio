// Sección de idiomas: dos tarjetas (Español / Inglés) con bandera SVG inline, badge y detalle.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Necesario para insertar SVG de bandera de forma segura
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// Estructura de cada idioma: bandera SVG, nivel y lista de detalles
interface Language {
  name: string;
  level: string;
  flagSvg: string;   // SVG inline de la bandera nacional
  isNative: boolean; // Controla el color del badge y el ícono de cada detalle
  details: string[];
}

// Bandera argentina (celeste y blanco con sol de mayo simplificado)
const FLAG_AR = `<svg width="48" height="34" viewBox="0 0 48 34" fill="none" class="lang__flag"><defs><clipPath id="flagClipAR"><rect width="48" height="34" rx="6"/></clipPath></defs><g clip-path="url(#flagClipAR)"><rect width="48" height="34" fill="#fff"/><rect width="48" height="11.3" fill="#74ACDF"/><rect y="22.7" width="48" height="11.3" fill="#74ACDF"/><circle cx="24" cy="17" r="4.5" fill="#F6B40E"/><line x1="24" y1="11.5" x2="24" y2="13" stroke="#F6B40E" stroke-width="0.8"/><line x1="24" y1="21" x2="24" y2="22.5" stroke="#F6B40E" stroke-width="0.8"/><line x1="18" y1="17" x2="19.5" y2="17" stroke="#F6B40E" stroke-width="0.8"/><line x1="28.5" y1="17" x2="30" y2="17" stroke="#F6B40E" stroke-width="0.8"/></g></svg>`;

// Bandera estadounidense (barras rojas y canton azul con estrellas simplificadas)
const FLAG_US = `<svg width="48" height="34" viewBox="0 0 48 34" fill="none" class="lang__flag"><defs><clipPath id="flagClipUS"><rect width="48" height="34" rx="6"/></clipPath></defs><g clip-path="url(#flagClipUS)"><rect width="48" height="34" fill="#fff"/><rect y="0" width="48" height="2.615" fill="#B22234"/><rect y="5.231" width="48" height="2.615" fill="#B22234"/><rect y="10.462" width="48" height="2.615" fill="#B22234"/><rect y="15.692" width="48" height="2.615" fill="#B22234"/><rect y="20.923" width="48" height="2.615" fill="#B22234"/><rect y="26.154" width="48" height="2.615" fill="#B22234"/><rect y="31.385" width="48" height="2.615" fill="#B22234"/><rect y="2.615" width="48" height="2.615" fill="#fff"/><rect y="7.846" width="48" height="2.615" fill="#fff"/><rect y="13.077" width="48" height="2.615" fill="#fff"/><rect y="18.308" width="48" height="2.615" fill="#fff"/><rect y="23.538" width="48" height="2.615" fill="#fff"/><rect y="28.769" width="48" height="2.615" fill="#fff"/><rect width="22" height="18.308" fill="#3C3B6E"/><circle cx="3.5" cy="2.8" r="0.7" fill="#fff"/><circle cx="3.5" cy="6" r="0.7" fill="#fff"/><circle cx="3.5" cy="9.2" r="0.7" fill="#fff"/><circle cx="3.5" cy="12.4" r="0.7" fill="#fff"/><circle cx="8" cy="2.8" r="0.7" fill="#fff"/><circle cx="8" cy="6" r="0.7" fill="#fff"/><circle cx="8" cy="9.2" r="0.7" fill="#fff"/><circle cx="8" cy="12.4" r="0.7" fill="#fff"/><circle cx="12.5" cy="2.8" r="0.7" fill="#fff"/><circle cx="12.5" cy="6" r="0.7" fill="#fff"/><circle cx="12.5" cy="9.2" r="0.7" fill="#fff"/><circle cx="12.5" cy="12.4" r="0.7" fill="#fff"/><circle cx="17" cy="2.8" r="0.7" fill="#fff"/><circle cx="17" cy="6" r="0.7" fill="#fff"/><circle cx="17" cy="9.2" r="0.7" fill="#fff"/><circle cx="17" cy="12.4" r="0.7" fill="#fff"/></g></svg>`;

// Lista de idiomas; se pueden agregar más entradas sin cambiar el template
const LANGUAGES: Language[] = [
  {
    name: 'Español',
    level: 'Nativo',
    flagSvg: FLAG_AR,
    isNative: true,
    details: [
      'Lengua materna',
      'Comunicación técnica oral y escrita',
      'Redacción de documentación y guías',
    ],
  },
  {
    name: 'Inglés',
    level: 'Básico / Intermedio',
    flagSvg: FLAG_US,
    isNative: false,
    details: [
      'Lectura de documentación técnica',
      'Comunicación oral básica',
      'Estudios actualmente en curso',
    ],
  },
];

@Component({
  selector: 'app-seccion-idiomas',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './seccion-idiomas.component.html',
  styleUrls: ['./seccion-idiomas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionIdiomasComponent implements AfterViewInit {

  languages = LANGUAGES;

  // Map de SVGs de bandera pre-sanitizados para que Angular permita [innerHTML]
  safeFlagMap: Record<string, SafeHtml> = {};

  constructor(private sanitizer: DomSanitizer) {
    // Santifico cada bandera SVG al construir el componente (evita XSS)
    for (const lang of LANGUAGES) {
      this.safeFlagMap[lang.name] = this.sanitizer.bypassSecurityTrustHtml(lang.flagSvg);
    }
  }

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
