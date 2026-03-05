// Sección de contacto: formulario de mensaje + tarjeta de links (GitHub, LinkedIn, mail, CV).
import { Component, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ApiService, DatosContacto } from '../../../core/services/api.service'; // Envío HTTP del formulario
import { environment } from '../../../../environments/environment'; // Site key de Turnstile

declare const lucide: any;    // Lucide cargado desde CDN via script en index.html
declare const turnstile: any; // Cloudflare Turnstile — cargado desde CDN (api.js?render=explicit)

// Estructura de errores de validación del formulario
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Datos de cada enlace de contacto (icono Lucide, etiqueta, color de acento)
interface ContactLink {
  icon: string;
  label: string;
  value: string;
  href: string;
  color: string;
}

// Lista estática de links de contacto mostrados en la columna derecha
const CONTACT_LINKS: ContactLink[] = [
  {
    icon: 'github',
    label: 'GitHub',
    value: '@marcostoledo96',
    href: 'https://github.com/marcostoledo96',
    color: '#6e7681',
  },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    value: 'Marcos Ezequiel Toledo',
    href: 'https://linkedin.com/in/marcostoledo96',
    color: '#0a66c2',
  },
  {
    icon: 'mail',
    label: 'E-mail',
    value: 'marcostoledo96@gmail.com',
    href: 'mailto:marcostoledo96@gmail.com',
    color: '#ea580c',
  },
  {
    icon: 'file-down',
    label: 'Curriculum Vitae',
    value: 'Descargar PDF',
    href: 'assets/doc/CV_ToledoMarcos_IT.pdf',
    color: '#8b5cf6',
  },
];

@Component({
  selector: 'app-seccion-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimateOnScrollDirective, ParallaxDirective],
  templateUrl: './seccion-contacto.component.html',
  styleUrls: ['./seccion-contacto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionContactoComponent implements AfterViewInit, OnDestroy {

  // Modelo del formulario ligado con [(ngModel)]
  formData: DatosContacto = { name: '', email: '', message: '' };
  errors: FormErrors = {}; // Errores de validación por campo
  sending = false;         // Deshabilita el botón mientras se envía
  sent = false;            // Muestra el estado de éxito al enviar
  focusedField: string | null = null; // Controla el estilo "focused" en el input activo

  // Token real de Cloudflare Turnstile. Vacío = CAPTCHA no completado
  turnstileToken = '';
  // Honeypot: campo invisible; si un bot lo rellena, bloqueamos el envío
  honeypotValue = '';
  // ID del widget Turnstile para poder resetearlo y destruirlo
  private turnstileWidgetId: string | null = null;

  contactLinks = CONTACT_LINKS; // Lista de links de la columna derecha

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  /**
   * Renderiza el widget de Cloudflare Turnstile en el contenedor #turnstile-container.
   * Reintenta cada 200ms hasta 15 veces si el script aún no cargó (carga async).
   */
  private initTurnstile(attempts = 0): void {
    if (typeof turnstile === 'undefined') {
      if (attempts < 15) setTimeout(() => this.initTurnstile(attempts + 1), 200);
      return;
    }
    const container = document.getElementById('turnstile-container');
    if (!container) return; // El formulario no está visible todavía (estado success=true)

    // Destruir widget anterior si existe (caso: form re-aparece tras éxito)
    if (this.turnstileWidgetId !== null) {
      try { turnstile.remove(this.turnstileWidgetId); } catch { /* ignoro */ }
      this.turnstileWidgetId = null;
    }

    this.turnstileWidgetId = turnstile.render('#turnstile-container', {
      sitekey: environment.turnstileSiteKey,
      theme: 'auto', // Respeta el esquema claro/oscuro del sistema
      // Token válido: se activa cuando el usuario pasa la verificación
      callback: (token: string) => {
        this.ngZone.run(() => { this.turnstileToken = token; this.cdr.markForCheck(); });
      },
      // Token expirado: el usuario tardó demasiado sin enviar
      'expired-callback': () => {
        this.ngZone.run(() => { this.turnstileToken = ''; this.cdr.markForCheck(); });
      },
      // Error: problema de red o rechazo explícito (posible bot)
      'error-callback': () => {
        this.ngZone.run(() => { this.turnstileToken = ''; this.cdr.markForCheck(); });
      },
    });
  }

  // Valida los campos del formulario y retorna los errores encontrados
  private validate(): FormErrors {
    const e: FormErrors = {};
    if (!this.formData.name.trim()) e.name = 'El nombre es obligatorio.';
    if (!this.formData.email.trim()) {
      e.email = 'El email es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) {
      e.email = 'Ingres\u00e1 un email v\u00e1lido.';
    }
    if (!this.formData.message.trim()) e.message = 'El mensaje es obligatorio.';
    return e;
  }

  // Limpio el error de un campo cuando el usuario empieza a escribir de vuelta
  clearError(field: keyof FormErrors): void {
    if (this.errors[field]) {
      this.errors = { ...this.errors, [field]: undefined };
    }
  }

  // Valido, y si no hay errores, envío el mensaje via ApiService
  onSubmit(): void {
    const newErrors = this.validate();
    this.errors = newErrors;
    if (Object.keys(newErrors).some(k => (newErrors as any)[k])) return; // Detengo si hay errores
    if (this.honeypotValue !== '') return; // Bot detectado por honeypot
    if (!this.turnstileToken) return;      // CAPTCHA Turnstile no completado

    this.sending = true;
    this.cdr.markForCheck();
    // Incluímos el token de Turnstile: el backend lo valida con Cloudflare antes de enviar el email
    this.apiService.sendContactMessage({ ...this.formData, turnstileToken: this.turnstileToken }).subscribe({
      next: () => {
        this.sent = true;
        this.sending = false;
        this.formData = { name: '', email: '', message: '' }; // Limpio el formulario
        this.turnstileToken = ''; // Invalido el token ya usado
        this.cdr.markForCheck();
        setTimeout(() => {
          this.sent = false;
          this.cdr.markForCheck();
          // Cuando el formulario vuelve a ser visible, re-inicializo el widget de Turnstile
          setTimeout(() => this.initTurnstile(), 100);
        }, 5000); // Oculto éxito a los 5s
      },
      error: () => {
        this.sending = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Aplico el color del link como borde y fondo tenue al hacer hover (manipulación directa del DOM)
  onLinkEnter(event: MouseEvent, link: ContactLink): void {
    const el = event.currentTarget as HTMLElement;
    el.style.borderColor = link.color + '40'; // Opacidad 25% del color del link
    el.style.backgroundColor = link.color + '14'; // Opacidad ~8%
  }
  // Restauro los estilos al salir del hover
  onLinkLeave(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.borderColor = '';
    el.style.backgroundColor = '';
  }

  // Inicializo los íconos de Lucide y el widget de Turnstile después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    this.initTurnstile();
  }

  // Limpio el widget de Turnstile para evitar memory leaks
  ngOnDestroy(): void {
    if (this.turnstileWidgetId !== null) {
      try { turnstile.remove(this.turnstileWidgetId); } catch { /* ya destruido */ }
    }
  }
}
