import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

declare const lucide: any;

const PHRASES = [
  'Desarrollador Full Stack & QA Tester.',
  'Apasionado por la calidad y el código limpio.',
  'Potenciando el desarrollo con Inteligencia Artificial.',
  'Transformando ideas en soluciones digitales.',
];

const SOCIALS = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/marcostoledo96' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/marcostoledo96' },
  { icon: 'mail', label: 'Email', href: 'mailto:marcostoledo96@gmail.com' },
  { icon: 'download', label: 'Descargar CV', href: 'assets/doc/CV_ToledoMarcos_IT.pdf' },
];

const STATS = [
  { value: 8, suffix: '+', label: 'Proyectos' },
  { value: 18, suffix: '',  label: 'Tecnologías' },
];

@Component({
  selector: 'app-seccion-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seccion-hero.component.html',
  styleUrls: ['./seccion-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeccionHeroComponent implements OnInit, OnDestroy, AfterViewInit {
  socials = SOCIALS;
  stats = STATS;
  displayText = '';
  counters: number[] = [0, 0];

  private phrases = PHRASES;
  private phraseIdx = 0;
  private charIdx = 0;
  private deleting = false;
  private timer: any;
  private countersStarted = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.tick();
    // Hero is above-the-fold: start counter after fade-in completes
    setTimeout(() => this.onStatsVisible(), 800);
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  private tick(): void {
    const current = this.phrases[this.phraseIdx];
    if (!this.deleting) {
      if (this.charIdx < current.length) {
        this.charIdx++;
        this.displayText = current.slice(0, this.charIdx);
        this.cdr.markForCheck();
        this.timer = setTimeout(() => this.tick(), 60);
      } else {
        this.timer = setTimeout(() => {
          this.deleting = true;
          this.tick();
        }, 2200);
      }
    } else {
      if (this.charIdx > 0) {
        this.charIdx--;
        this.displayText = current.slice(0, this.charIdx);
        this.cdr.markForCheck();
        this.timer = setTimeout(() => this.tick(), 30);
      } else {
        this.deleting = false;
        this.phraseIdx = (this.phraseIdx + 1) % this.phrases.length;
        this.tick();
      }
    }
  }

  onStatsVisible(): void {
    if (this.countersStarted) return;
    this.countersStarted = true;
    STATS.forEach((stat, i) => {
      this.animateCounter(i, stat.value, 1600);
    });
  }

  private animateCounter(index: number, target: number, duration: number): void {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      this.counters[index] = Math.floor(eased * target);
      this.cdr.markForCheck();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  isExternal(href: string): boolean {
    return href.startsWith('http');
  }

  isDownload(href: string): boolean {
    return href.startsWith('assets/');
  }
}
