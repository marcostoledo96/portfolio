// ============================================================================
// ThemeService: servicio para manejar el cambio entre modo claro y oscuro
// ============================================================================
// Acá manejo el cambio entre modo claro y oscuro.
// Guardo la preferencia en localStorage para que persista entre sesiones.
// Cuando cambio el tema, actualizo las clases en <body> y <html>.

// === IMPORTS ===
// Injectable: decorador que convierte la clase en un servicio inyectable
// Inject: decorador para inyectar tokens (como DOCUMENT)
import { Injectable, Inject } from '@angular/core';

// BehaviorSubject: tipo especial de Observable que:
//   1. Guarda el último valor emitido
//   2. Emite ese valor a nuevos suscriptores inmediatamente
// Observable: flujo de datos al que me puedo suscribir para recibir actualizaciones
import { BehaviorSubject, Observable } from 'rxjs';

// DOCUMENT: token para inyectar el objeto Document del navegador de forma segura
// (en vez de usar 'document' directamente, que podría no existir en SSR)
import { DOCUMENT } from '@angular/common';

// === TYPE ALIAS ===
// export: hace que este tipo sea importable desde otros archivos
// type: crea un alias de tipo (como un typedef en C)
// Theme = solo puede ser 'claro' O 'oscuro' (union type)
// Esto me da autocompletado y TypeScript me avisa si escribo mal
export type Theme = 'claro' | 'oscuro';

// === DECORADOR @Injectable ===
// Convierte la clase en un servicio que Angular puede inyectar
@Injectable({
    // providedIn: 'root' = singleton global
    // Angular crea UNA sola instancia de este servicio y la comparte en toda la app
    // Si pusiera providedIn: 'any', crearía una instancia por módulo
    providedIn: 'root'
})
export class ThemeService {
    
    // === PROPIEDADES PRIVADAS ===
    
    // readonly: constante que no se puede modificar después de asignarla
    // La uso como clave para guardar/leer en localStorage
    private readonly CLAVE_TEMA = 'tema';
    
    // BehaviorSubject<Theme>: Observable que guarda el tema actual
    // <Theme> = tipo genérico (solo acepta 'claro' o 'oscuro')
    // BehaviorSubject vs Subject:
    //   - Subject: solo emite a los que YA están suscritos
    //   - BehaviorSubject: emite el último valor a NUEVOS suscriptores también
    private temaActual: BehaviorSubject<Theme>;
    
    // === PROPIEDADES PÚBLICAS ===
    
    // Observable<Theme>: versión readonly del BehaviorSubject
    // Los componentes pueden suscribirse (.subscribe()) pero NO pueden emitir valores (.next())
    public tema$: Observable<Theme>;
    // $ al final es una convención para indicar que es un Observable

    // === CONSTRUCTOR ===
    // Se ejecuta UNA vez cuando Angular crea el servicio (singleton)
    // @Inject(DOCUMENT): le digo a Angular "injectáme el objeto Document"
    // DOCUMENT es un token (un identificador) que Angular usa para inyectar dependencias
    // ¿Por qué no uso 'document' directamente?
    //   - En SSR (Server-Side Rendering) 'document' no existe
    //   - Usando DOCUMENT, Angular puede proveer un mock en tests
    constructor(@Inject(DOCUMENT) private document: Document) {
        // === LEO EL TEMA GUARDADO EN LOCALSTORAGE ===
        
        // localStorage.getItem(): API del navegador para leer datos guardados
        // Devuelve string | null (string si existe, null si no)
        // as Theme: le digo a TypeScript "confía en mí, esto es Theme"
        // || 'oscuro': operador OR - si localStorage devuelve null, uso 'oscuro' por defecto
        const temaGuardado = (localStorage.getItem(this.CLAVE_TEMA) as Theme) || 'oscuro';
        
        // === INICIALIZO EL BEHAVIORSUBJECT ===
        
        // new BehaviorSubject<Theme>(valor): creo un BehaviorSubject con valor inicial
        // A partir de ahora, temaGuardado es el "valor actual" del BehaviorSubject
        this.temaActual = new BehaviorSubject<Theme>(temaGuardado);
        
        // === CREO EL OBSERVABLE PÚBLICO ===
        
        // asObservable(): convierte el BehaviorSubject en Observable readonly
        // Los componentes pueden:
        //   - Leer: this.servicioTema.tema$.subscribe(...) ✓
        //   - NO pueden escribir: this.servicioTema.tema$.next(...) ✗ (error de compilación)
        this.tema$ = this.temaActual.asObservable();

        // === APLICO EL TEMA AL DOM ===
        
        // Aplico el tema desde el inicio (agrego/quito clases CSS)
        this.aplicarTema(temaGuardado);
    }

    // === MÉTODO PÚBLICO: OBTENER TEMA ACTUAL ===
    // Devuelvo el tema actual sin necesidad de suscribirse
    // Útil para leer el tema de forma síncrona (instantánea)
    obtenerTemaActual(): Theme {
        // .value: propiedad de BehaviorSubject que devuelve el último valor emitido
        // NO necesito hacer .subscribe() para obtenerlo
        return this.temaActual.value;
    }

    // === MÉTODO PÚBLICO: ALTERNAR TEMA ===
    // Cambio entre claro y oscuro (toggle)
    alternarTema(): void {
        // Operador ternario: condición ? valorSiTrue : valorSiFalse
        // Si el tema actual es 'claro', cambio a 'oscuro'
        // Si el tema actual es 'oscuro', cambio a 'claro'
        const nuevoTema: Theme = this.temaActual.value === 'claro' ? 'oscuro' : 'claro';
        
        // Establezco el nuevo tema
        this.establecerTema(nuevoTema);
    }

    // === MÉTODO PÚBLICO: ESTABLECER TEMA ===
    // Fuerzo un tema específico ('claro' o 'oscuro')
    establecerTema(tema: Theme): void {
        // .next(valor): método de BehaviorSubject para emitir un nuevo valor
        // Todos los componentes suscritos reciben el nuevo tema automáticamente
        this.temaActual.next(tema);
        
        // Aplico el tema al DOM (agrego/quito clases CSS)
        this.aplicarTema(tema);
        
        // localStorage.setItem(): API del navegador para guardar datos
        // Persiste entre sesiones (aunque cierre el navegador)
        // Parámetros: (clave, valor)
        // Ambos deben ser strings
        localStorage.setItem(this.CLAVE_TEMA, tema);
    }

    // === MÉTODO PRIVADO: APLICAR TEMA AL DOM ===
    // Agrego o quito la clase 'claro' en <body> y <html>
    // Las variables CSS cambian automáticamente según la clase
    private aplicarTema(tema: Theme): void {
        // this.document.body: referencia al elemento <body>
        const body = this.document.body;
        
        // this.document.documentElement: referencia al elemento <html>
        const html = this.document.documentElement;

        // Si el tema es 'claro', agrego la clase 'claro'
        if (tema === 'claro') {
            // classList.add(): API del DOM para agregar una clase CSS
            body.classList.add('claro');
            html.classList.add('claro');
            
            // Ahora en CSS:
            // body.claro { --color-fondo: #ffffff; }
            // Las variables CSS cambian automáticamente
        } else {
            // Si el tema es 'oscuro', quito la clase 'claro'
            // classList.remove(): API del DOM para quitar una clase CSS
            body.classList.remove('claro');
            html.classList.remove('claro');
            
            // Ahora en CSS:
            // body { --color-fondo: #0a0a0a; }
        }
    }
}
