// SeoService Tests: verifica que `init()` configure título, meta tags, Open Graph,
// canonical, JSON-LD y que no duplique tags al llamarse más de una vez.

import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    // Limpio tags previos que pudieran haber quedado de tests anteriores
    document.head.querySelectorAll(
      'meta[name], meta[property], link[rel="canonical"], link[rel="alternate"], script[type="application/ld+json"]'
    ).forEach(el => el.remove());

    TestBed.configureTestingModule({
      imports: [BrowserModule],
      providers: [SeoService],
    });

    service = TestBed.inject(SeoService);
  });

  afterEach(() => {
    document.head.querySelectorAll(
      'meta[name], meta[property], link[rel="canonical"], link[rel="alternate"], script[type="application/ld+json"]'
    ).forEach(el => el.remove());
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('init()', () => {
    beforeEach(() => {
      service.init();
    });

    it('setea el título del documento con el nombre del titular', () => {
      expect(document.title).toContain('Marcos');
    });

    it('crea la meta description', () => {
      const meta = document.head.querySelector('meta[name="description"]');
      expect(meta).toBeTruthy();
      expect(meta?.getAttribute('content')).toBeTruthy();
    });

    it('crea la meta author', () => {
      const meta = document.head.querySelector('meta[name="author"]');
      expect(meta?.getAttribute('content')).toContain('Marcos');
    });

    it('crea la meta robots', () => {
      const meta = document.head.querySelector('meta[name="robots"]');
      expect(meta?.getAttribute('content')).toBe('index, follow');
    });

    it('crea og:title', () => {
      const meta = document.head.querySelector('meta[property="og:title"]');
      expect(meta).toBeTruthy();
    });

    it('crea og:description', () => {
      const meta = document.head.querySelector('meta[property="og:description"]');
      expect(meta).toBeTruthy();
    });

    it('crea og:image', () => {
      const meta = document.head.querySelector('meta[property="og:image"]');
      expect(meta).toBeTruthy();
    });

    it('crea og:url', () => {
      const meta = document.head.querySelector('meta[property="og:url"]');
      expect(meta).toBeTruthy();
    });

    it('crea og:locale con valor es_AR', () => {
      const meta = document.head.querySelector('meta[property="og:locale"]');
      expect(meta?.getAttribute('content')).toBe('es_AR');
    });

    it('inyecta el script JSON-LD en el <head>', () => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();
    });

    it('el JSON-LD contiene los datos correctos de la persona', () => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.textContent ?? '[]');
      expect(Array.isArray(data)).toBeTrue();
      const profilePage = data.find((d: any) => d['@type'] === 'ProfilePage');
      expect(profilePage).toBeTruthy();
      const person = profilePage.mainEntity;
      expect(person['@type']).toBe('Person');
      expect(person.name).toBe('Marcos Ezequiel Toledo');
      expect(person.jobTitle).toBeTruthy();
      expect(person.url).toBeTruthy();
    });

    it('el JSON-LD incluye los links de sameAs', () => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.textContent ?? '[]');
      const person = data.find((d: any) => d['@type'] === 'ProfilePage')?.mainEntity;
      expect(Array.isArray(person?.sameAs)).toBeTrue();
      expect(person.sameAs.some((url: string) => url.includes('github'))).toBeTrue();
    });

    it('el JSON-LD incluye el schema WebSite', () => {
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const data = JSON.parse(script?.textContent ?? '[]');
      const website = data.find((d: any) => d['@type'] === 'WebSite');
      expect(website).toBeTruthy();
      expect(website.url).toBeTruthy();
    });

    it('inserta los hreflang alternates para es, en y x-default', () => {
      const es = document.head.querySelector('link[hreflang="es"]');
      const en = document.head.querySelector('link[hreflang="en"]');
      const xDefault = document.head.querySelector('link[hreflang="x-default"]');
      expect(es).toBeTruthy();
      expect(en).toBeTruthy();
      expect(xDefault).toBeTruthy();
    });

    it('crea og:site_name', () => {
      const meta = document.head.querySelector('meta[property="og:site_name"]');
      expect(meta).toBeTruthy();
    });

    it('inserta el link canonical', () => {
      const canonical = document.head.querySelector('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
      expect(canonical?.getAttribute('href')).toBeTruthy();
    });

    it('no duplica tags al llamar init() dos veces', () => {
      service.init(); // segunda llamada

      const descriptions = document.head.querySelectorAll('meta[name="description"]');
      expect(descriptions.length).toBe(1);

      const canonicals = document.head.querySelectorAll('link[rel="canonical"]');
      expect(canonicals.length).toBe(1);

      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBe(1);

      const hreflangEs = document.head.querySelectorAll('link[hreflang="es"]');
      expect(hreflangEs.length).toBe(1);
    });
  });
});
