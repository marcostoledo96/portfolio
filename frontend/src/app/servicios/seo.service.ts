// SeoService — Inyecta meta tags dinámicos, Open Graph, Twitter Card, canonical y JSON-LD
// en el <head> al iniciar la app. Cada tag se crea solo si no existe previamente.
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

const SITE_URL   = 'https://www.marcostoledo.cv';
const FULL_TITLE = 'Marcos Ezequiel Toledo — Desarrollador de Software & QA Tester';
const DESCRIPTION =
  'Portfolio de Marcos Ezequiel Toledo, Desarrollador Full Stack Jr. y QA Tester. ' +
  'Proyectos con Angular, React, Node.js, TypeScript y más. Buenos Aires, Argentina.';
const KEYWORDS =
  'desarrollador web, QA tester, portfolio, Angular, React, Node.js, TypeScript, ' +
  'JavaScript, full stack, Buenos Aires, Argentina, Marcos Toledo, ' +
  'marcos ezequiel toledo, cv marcos toledo, desarrollador de software';
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
    this.setProperty('og:image:width', '1200');
    this.setProperty('og:image:height','630');
    this.setProperty('og:url',         SITE_URL);
    this.setProperty('og:locale',      'es_AR');
    this.setProperty('og:site_name',   'Marcos Ezequiel Toledo');

    // ── 4. Twitter Card ──────────────────────────────────────────────────────
    this.setMeta('twitter:card',        'summary_large_image');
    this.setMeta('twitter:title',       FULL_TITLE);
    this.setMeta('twitter:description', DESCRIPTION);
    this.setMeta('twitter:image',       OG_IMAGE);

    // ── 5. Canonical ─────────────────────────────────────────────────────────
    this.ensureCanonical(SITE_URL);

    // ── 6. hreflang alternates (español, inglés, x-default) ──────────────────
    this.ensureHreflang('es', SITE_URL);
    this.ensureHreflang('en', `${SITE_URL}/en`);
    this.ensureHreflang('x-default', SITE_URL);

    // ── 7. JSON-LD (schema.org ProfilePage + WebSite) ────────────────────────
    this.ensureJsonLd([
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: 'Marcos Ezequiel Toledo',
          givenName: 'Marcos Ezequiel',
          familyName: 'Toledo',
          jobTitle: 'Desarrollador de Software & QA Tester',
          description: DESCRIPTION,
          url: SITE_URL,
          image: `${SITE_URL}/assets/img/Foto_Perfil.webp`,
          email: 'mailto:marcostoledo96@gmail.com',
          knowsAbout: [
            'Angular', 'React', 'TypeScript', 'JavaScript', 'Node.js',
            'HTML', 'CSS', 'SCSS', 'PostgreSQL', 'MySQL', 'SQL Server',
            'QA Testing', 'Git', 'Figma', 'Jira', 'Scrum', 'UML',
          ],
          alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'IFTS N°16',
          },
          worksFor: {
            '@type': 'Organization',
            name: 'AEROTEST',
          },
          sameAs: [
            'https://github.com/marcostoledo96',
            'https://www.linkedin.com/in/marcos-ezequiel-toledo',
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Buenos Aires',
            addressCountry: 'AR',
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Marcos Ezequiel Toledo — Portfolio',
        url: SITE_URL,
        inLanguage: ['es', 'en'],
        author: { '@id': `${SITE_URL}/#person` },
      },
    ]);
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

  /** Inserta <link rel="alternate" hreflang="..."> si no existe */
  private ensureHreflang(lang: string, url: string): void {
    const head = this.document.head;
    if (head.querySelector(`link[hreflang="${lang}"]`)) return;
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang);
    link.setAttribute('href', url);
    head.appendChild(link);
  }

  /** Inserta un <script type="application/ld+json"> si no existe */
  private ensureJsonLd(data: object | object[]): void {
    const head = this.document.head;
    if (head.querySelector('script[type="application/ld+json"]')) return;
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    head.appendChild(script);
  }
}
