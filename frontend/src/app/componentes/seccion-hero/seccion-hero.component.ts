import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild,
  Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParallaxDirective } from '../../core/directivas/parallax.directive';

declare const lucide: any;

const PHRASES = [
  'QA Tester & Desarrollador Full Stack.',
  'Especializado en Transformación Digital en Salud (HealthTech).',
  'Apasionado por la calidad del software y el código limpio.',
  'Potenciando la eficiencia y calidad con Inteligencia Artificial.',
  'Construyendo interfaces modernas con Angular y React.',
];

const SOCIALS = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/marcostoledo96' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/marcos-ezequiel-toledo' },
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
  imports: [CommonModule, ParallaxDirective],
  templateUrl: './seccion-hero.component.html',
  styleUrls: ['./seccion-hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeccionHeroComponent implements OnInit, OnDestroy, AfterViewInit {  // Emite el id de sección al padre (AppComponent) para que este maneje el scroll
  // con la lógica completa de force-load de secciones lazy + espera de rAF.
  @Output() navTo = new EventEmitter<string>();
  socials = SOCIALS;
  stats = STATS;
  phrases = PHRASES;
  phraseIdx = 0;
  displayText = '';
  counters: number[] = [0, 0];

  private charIdx = 0;
  private deleting = false;
  private timer: any;
  private pauseTimer: any;
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
    clearTimeout(this.pauseTimer);
  }

  goTo(index: number): void {
    clearTimeout(this.timer);
    clearTimeout(this.pauseTimer);
    this.phraseIdx = index;
    this.charIdx = this.phrases[index].length;
    this.deleting = false;
    this.displayText = this.phrases[index];
    this.cdr.markForCheck();
    this.pauseTimer = setTimeout(() => {
      this.deleting = true;
      this.tick();
    }, 4000);
  }

  goNext(): void {
    this.goTo((this.phraseIdx + 1) % this.phrases.length);
  }

  goPrev(): void {
    this.goTo((this.phraseIdx - 1 + this.phrases.length) % this.phrases.length);
  }

  private tick(): void {
    const current = this.phrases[this.phraseIdx] ?? '';
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

  // scrollTo se mantiene para los scroll indicators internos (sobre-mi)
  // que apuntan a secciones no-lazy. Los CTAs (portfolio, contacto) ya usan navTo.
  scrollTo(sectionId: string, desktopBlock: ScrollLogicalPosition = 'start'): void {
    const isMobile = window.innerWidth < 1024;
    const block: ScrollLogicalPosition = isMobile ? 'start' : desktopBlock;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block });
  }
}
