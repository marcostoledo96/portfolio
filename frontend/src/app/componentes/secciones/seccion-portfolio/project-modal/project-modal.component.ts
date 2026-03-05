// Modal de detalle de proyecto: carousel de imágenes, badges, descripción larga, tecnologías y links.
import {
  Component, Input, Output, EventEmitter, OnChanges, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef, HostListener, SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Project } from '../project.model';
import { ImageCarouselComponent } from '../image-carousel/image-carousel.component';
import { ImageLightboxComponent } from '../image-lightbox/image-lightbox.component';

declare const lucide: any;

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ImageCarouselComponent, ImageLightboxComponent],
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Backdrop: fade in/out
    trigger('backdropAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    // Contenedor del modal: scale + fade in/out
    trigger('modalAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.92)' }),
        animate('250ms cubic-bezier(0.34, 1.20, 0.64, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('180ms ease-in', style({ opacity: 0, transform: 'scale(0.92)' })),
      ]),
    ]),
  ],
})
export class ProjectModalComponent implements OnChanges, OnDestroy {
  @Input() project: Project | null = null;
  @Output() closeModal = new EventEmitter<void>();

  /** Índice de imagen a mostrar en el lightbox (null = cerrado) */
  lightboxIndex: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project']) {
      if (this.project) {
        // Bloquea el scroll del body al abrir el modal
        document.body.style.overflow = 'hidden';
        this.lightboxIndex = null;
        // Renderiza los íconos Lucide del modal tras un tick
        setTimeout(() => {
          if (typeof lucide !== 'undefined') lucide.createIcons();
        });
      } else {
        // Restaura el scroll al cerrar
        document.body.style.overflow = '';
      }
    }
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  openLightbox(idx: number): void {
    this.lightboxIndex = idx;
    this.cdr.markForCheck();
  }

  closeLightbox(): void {
    this.lightboxIndex = null;
    this.cdr.markForCheck();
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  /** Escape cierra el modal si el lightbox no está abierto */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightboxIndex !== null) return; // El lightbox maneja su propio Escape
    if (this.project) this.closeModal.emit();
  }
}
