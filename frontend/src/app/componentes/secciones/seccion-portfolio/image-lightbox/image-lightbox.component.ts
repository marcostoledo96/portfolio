// Visor fullscreen de imágenes con navegación por teclado y puntos indicadores.
import {
  Component, Input, Output, EventEmitter, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

declare const lucide: any;

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-lightbox.component.html',
  styleUrl: './image-lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Fade in/out del overlay completo al entrar / salir del DOM
    trigger('lightboxFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
    // Crossfade al cambiar la imagen activa
    trigger('imgFade', [
      transition(':increment, :decrement', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ImageLightboxComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() initialIndex = 0;
  @Output() close = new EventEmitter<void>();

  currentIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currentIndex = this.initialIndex;
    // Re-renderiza íconos Lucide (flechas/cerrar) una vez que el DOM está listo
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
    // Precarga todas las imágenes del lightbox al abrirse
    this.images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  /** Navega circularmente a cualquier índice */
  goTo(idx: number): void {
    const len = this.images.length;
    this.currentIndex = ((idx % len) + len) % len;
    this.cdr.markForCheck();
  }
  prev(event: MouseEvent): void { event.stopPropagation(); this.goTo(this.currentIndex - 1); }
  next(event: MouseEvent): void { event.stopPropagation(); this.goTo(this.currentIndex + 1); }

  onBackdropClick(): void { this.close.emit(); }

  /** Navegación por teclado: Escape cierra, ← / → navegan */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':    this.close.emit(); break;
      case 'ArrowLeft': this.goTo(this.currentIndex - 1); break;
      case 'ArrowRight':this.goTo(this.currentIndex + 1); break;
    }
  }
}
