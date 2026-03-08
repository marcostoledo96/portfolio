// SeoService — Inyecta meta tags dinámicos, Open Graph, Twitter Card, canonical y JSON-LD
// en el <head> al iniciar la app. Cada tag se crea solo si no existe previamente.
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const SITE_URL   = 'https://marcostoledo.dev';
const FULL_TITLE = 'Marcos Ezequiel Toledo — Desarrollador de Software & QA Tester';
const DESCRIPTION =
  'Portfolio de Marcos Ezequiel Toledo, Desarrollador Full Stack Jr. y QA Tester. ' +
  'Proyectos con Angular, React, Node.js, TypeScript y más. Buenos Aires, Argentina.';
const KEYWORDS =
  'desarrollador web, QA tester, portfolio, Angular, React, Node.js, TypeScript, ' +
  'JavaScript, full stack, Buenos Aires, Argentina, Marcos Toledo';
const OG_IMAGE = `${SITE_URL}/assets/img/og-preview.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);

  init(): void {
    // ── 1. Título del documento ──────────────────────────────────────────────
    this.titleService.setTitle(FULL_TITLE);

    // ── 2. Meta básicos ──────────────────────────────────────────────────────
    this.setMeta('description', DESCRIPTION);
    this.setMeta('keywords', KEYWORDS);
    this.setMeta('author', 'Marcos Ezequiel Toledo');
    this.setMeta('robots', 'index, follow');

    // ── 3. Open Graph ────────────────────────────────────────────────────────
    this.setProperty('og:type',        'website');
    this.setProperty('og:title',       FULL_TITLE);
    this.setProperty('og:description', DESCRIPTION);
    this.setProperty('og:image',       OG_IMAGE);
    this.setProperty('og:url',         SITE_URL);
    this.setProperty('og:locale',      'es_AR');

    // ── 4. Twitter Card ──────────────────────────────────────────────────────
    this.setMeta('twitter:card',        'summary_large_image');
    this.setMeta('twitter:title',       FULL_TITLE);
    this.setMeta('twitter:description', DESCRIPTION);
    this.setMeta('twitter:image',       OG_IMAGE);

    // ── 5. Canonical ─────────────────────────────────────────────────────────
    this.ensureCanonical(SITE_URL);

    // ── 6. JSON-LD (schema.org Person) ───────────────────────────────────────
    this.ensureJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Marcos Ezequiel Toledo',
      jobTitle: 'Desarrollador de Software & QA Tester',
      url: SITE_URL,
      sameAs: [
        'https://github.com/marcostoledo96',
        'https://www.linkedin.com/in/marcos-ezequiel-toledo',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Buenos Aires',
        addressCountry: 'AR',
      },
    });
  }

  // ── Helpers privados ────────────────────────────────────────────────────────

  /** Crea o actualiza un <meta name="..."> */
  private setMeta(name: string, content: string): void {
    if (this.meta.getTag(`name="${name}"`)) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  /** Crea o actualiza un <meta property="..."> (Open Graph) */
  private setProperty(property: string, content: string): void {
    if (this.meta.getTag(`property="${property}"`)) {
      this.meta.updateTag({ property, content });
    } else {
      this.meta.addTag({ property, content });
    }
  }

  /** Inserta <link rel="canonical"> si no existe */
  private ensureCanonical(url: string): void {
    const head = this.document.head;
    if (head.querySelector('link[rel="canonical"]')) return;
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    head.appendChild(link);
  }

  /** Inserta un <script type="application/ld+json"> si no existe */
  private ensureJsonLd(data: object): void {
    const head = this.document.head;
    if (head.querySelector('script[type="application/ld+json"]')) return;
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    head.appendChild(script);
  }
}
