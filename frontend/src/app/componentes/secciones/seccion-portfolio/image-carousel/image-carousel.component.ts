// Carousel reutilizable de imágenes con crossfade, flechas, puntos y botón de zoom.
import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger, transition, style, animate,
} from '@angular/animations';

declare const lucide: any;

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Fade-in simple al cambiar la imagen (entrada desde opacidad 0)
    trigger('imgFade', [
      transition(':increment', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':decrement', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() title: string = '';
  /** Emite el índice de la imagen actual para abrir el lightbox */
  @Output() zoom = new EventEmitter<number>();

  currentIndex = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Precarga las primeras imágenes al abrir para que estén en caché
    this.images.slice(0, 3).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  /** Navega a un índice dado de forma circular */
  goTo(idx: number): void {
    const len = this.images.length;
    this.currentIndex = ((idx % len) + len) % len;
    this.cdr.markForCheck();
    // Precarga la imagen siguiente y anterior para eliminar latencia en la próxima navegación
    this.preload((this.currentIndex + 1) % len);
    this.preload(((this.currentIndex - 1) + len) % len);
  }

  private preload(idx: number): void {
    if (this.images[idx]) {
      const img = new Image();
      img.src = this.images[idx];
    }
  }

  prev(event: MouseEvent): void {
    event.stopPropagation();
    this.goTo(this.currentIndex - 1);
  }

  next(event: MouseEvent): void {
    event.stopPropagation();
    this.goTo(this.currentIndex + 1);
  }

  onZoom(event: MouseEvent): void {
    event.stopPropagation();
    this.zoom.emit(this.currentIndex);
  }
}
