// ImagenFallbackComponent — Envuelve <img> y muestra un placeholder SVG si la imagen falla.
import { Component, Input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-imagen-fallback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagen-fallback.component.html',
  styleUrls: ['./imagen-fallback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagenFallbackComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() className = '';
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() loading: 'lazy' | 'eager' = 'lazy';

  hasError = signal(false);

  onError(): void {
    this.hasError.set(true);
  }

  get sizeStyle(): { [key: string]: string } {
    const s: { [key: string]: string } = {};
    if (this.width)  s['width']  = typeof this.width  === 'number' ? `${this.width}px`  : this.width;
    if (this.height) s['height'] = typeof this.height === 'number' ? `${this.height}px` : this.height;
    return s;
  }
}
