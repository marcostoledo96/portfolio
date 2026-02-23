// Componente raíz: orquesta el layout general (sidebar, header móvil, secciones, footer).
// Detecta la sección activa y el progreso de scroll fuera de NgZone para no saturar el change detection.
import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, NgZone, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { TemaService } from './servicios/tema.service';
import { BarraLateralComponent, NAV_ITEMS } from './componentes/barra-lateral/barra-lateral.component';
import { EncabezadoMovilComponent } from './componentes/encabezado-movil/encabezado-movil.component';
import { BotonScrollArribaComponent } from './componentes/boton-scroll-arriba/boton-scroll-arriba.component';
import { SeccionHeroComponent } from './componentes/seccion-hero/seccion-hero.component';
import { SeccionSobreMiComponent } from './componentes/secciones/seccion-sobre-mi/seccion-sobre-mi.component';
import { SeccionHabilidadesTecnicasComponent } from './componentes/secciones/seccion-habilidades-tecnicas/seccion-habilidades-tecnicas.component';
import { SeccionHabilidadesBlandasComponent } from './componentes/secciones/seccion-habilidades-blandas/seccion-habilidades-blandas.component';
import { SeccionIdiomasComponent } from './componentes/secciones/seccion-idiomas/seccion-idiomas.component';
import { SeccionExperienciaComponent } from './componentes/secciones/seccion-experiencia/seccion-experiencia.component';
import { SeccionEducacionComponent } from './componentes/secciones/seccion-educacion/seccion-educacion.component';
import { SeccionPortfolioComponent } from './componentes/secciones/seccion-portfolio/seccion-portfolio.component';
import { SeccionContactoComponent } from './componentes/secciones/seccion-contacto/seccion-contacto.component';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    BarraLateralComponent,
    EncabezadoMovilComponent,
    BotonScrollArribaComponent,
    SeccionHeroComponent,
    SeccionSobreMiComponent,
    SeccionHabilidadesTecnicasComponent,
    SeccionHabilidadesBlandasComponent,
    SeccionIdiomasComponent,
    SeccionExperienciaComponent,
    SeccionEducacionComponent,
    SeccionPortfolioComponent,
    SeccionContactoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Portfolio - Marcos Ezequiel Toledo';

  activeSection = 'sobre-mi';   // ID de la sección visible en pantalla
  scrollProgress = 0;           // Ratio 0-1 para la barra de progreso del sidebar
  showScrollTop = false;        // Muestra el botón de scroll-to-top después de 400px
  isDrawerOpen = false;         // Estado del menú lateral en mobile

  @ViewChild('mainContent', { static: true }) mainRef!: ElementRef<HTMLElement>; // Referencia al <main> scrollable

  private sectionIds = NAV_ITEMS.map(n => n.id); // IDs de las secciones en orden de navegación
  private isScrolling = false;  // Bloqueo temporal durante scroll programático (handleNavClick)
  private ticking = false;      // Evita múltiples rAF en cola (patrón throttle con requestAnimationFrame)

  constructor(
    private ngZone: NgZone,
    private temaService: TemaService,
  ) {}

  ngOnInit(): void {
    // Registro el listener fuera de NgZone para que el scroll no dispare change detection en cada frame
    this.ngZone.runOutsideAngular(() => {
      this.mainRef.nativeElement.addEventListener('scroll', this.onScroll, { passive: true });
    });
    this.onScroll(); // Ejecuto una vez al montar para establecer el estado inicial
  }

  ngOnDestroy(): void {
    this.mainRef.nativeElement.removeEventListener('scroll', this.onScroll); // Evito memory leaks
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons(); // Inicializo íconos del footer
  }

  // Handler de scroll: usa rAF para throttlear a ~60fps y corre fuera de NgZone
  private onScroll = (): void => {
    if (this.ticking) return; // Ya hay un rAF pendiente; descarto el evento duplicado
    this.ticking = true;

    requestAnimationFrame(() => {
      const el = this.mainRef.nativeElement;
      const { scrollTop, scrollHeight, clientHeight } = el;

      // Calculo el progreso (0-1) y si hay que mostrar el botón de scroll-top
      const maxScroll = scrollHeight - clientHeight || 1;
      const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
      const showTop = scrollTop > 400;

      // Actualizo la barra de progreso directo en el DOM (sin change detection) para 60fps suaves
      const progressBarEl = document.querySelector('.sidebar__progress-bar') as HTMLElement;
      if (progressBarEl) {
        progressBarEl.style.transform = `scaleY(${progress})`;
      }

      // Detección de sección activa (bloqueada durante scroll programático para evitar parpadeos)
      let currentSection = this.activeSection;
      if (!this.isScrolling) {
        // Si llegué al fondo del contenido, activo la última sección
        if (scrollTop + clientHeight >= scrollHeight - 60) {
          currentSection = this.sectionIds[this.sectionIds.length - 1];
        } else {
          // Activo la última sección cuyo top superó el 30% de la altura visible
          const mainRect = el.getBoundingClientRect();
          const offset = clientHeight * 0.3;
          let current = this.sectionIds[0];

          for (const id of this.sectionIds) {
            const section = document.getElementById(id);
            if (section) {
              const elRect = section.getBoundingClientRect();
              const relativeTop = elRect.top - mainRect.top;
              if (relativeTop <= offset) {
                current = id;
              }
            }
          }
          currentSection = current;
        }
      }

      // Entro a NgZone solo si cambió algún valor para no desperdiciar ciclos de CD
      if (
        this.scrollProgress !== progress ||
        this.showScrollTop !== showTop ||
        this.activeSection !== currentSection
      ) {
        this.ngZone.run(() => {
          this.scrollProgress = progress;
          this.showScrollTop = showTop;
          this.activeSection = currentSection;
        });
      }

      this.ticking = false;
    });
  };

  // Navega a una sección: cierra el drawer, activa la sección y bloquea la detección 800ms
  handleNavClick(sectionId: string): void {
    this.isDrawerOpen = false;
    document.body.classList.remove('drawer-open');

    const el = document.getElementById(sectionId);
    if (!el) return;

    this.isScrolling = true; // Bloqueo detección mientras el scroll animado termina
    this.activeSection = sectionId;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      this.isScrolling = false; // Libero la detección tras ~800ms (duración estimada del scroll suave)
    }, 800);
  }

  // Abre/cierra el drawer móvil y agrega/quita la clase en body para bloquear el scroll de fondo
  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
    if (this.isDrawerOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
  }

  // Desplaza el contenido principal al inicio de forma animada
  scrollToTop(): void {
    this.mainRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
