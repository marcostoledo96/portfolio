// Modelo de datos compartido para la sección Portfolio.
// Importado por seccion-portfolio.component.ts y project-modal.component.ts.

export type ProjectStatus = 'in-dev' | 'finished';
export type TeamType = 'individual' | 'team';

export interface Project {
  title: string;
  description: string;        // Descripción corta para la tarjeta
  longDescription: string;    // Descripción extensa para el modal de detalle
  image: string;              // Imagen thumbnail de la tarjeta
  images: string[];           // Array de imágenes para el carousel del modal
  status: ProjectStatus;
  statusLabel: string;        // Texto para mostrar en el badge de estado
  teamType: TeamType;
  teamLabel: string;          // Texto para mostrar en el badge de equipo
  technologies: string[];
  featured: boolean;          // Muestra el badge "Destacado"
  siteUrl?: string;           // URL de demo (opcional)
  siteLabel?: string;         // Texto personalizado del botón de demo (opcional, default: 'Demo')
  githubUrl?: string;         // URL del repositorio (opcional)
}
