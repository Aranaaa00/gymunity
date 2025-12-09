import { Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Componente wrapper para iconos Lucide.
 * Los iconos están registrados globalmente en app.config.ts
 */
@Component({
  selector: 'app-icono',
  imports: [LucideAngularModule],
  templateUrl: './icono.html',
  styleUrl: './icono.scss',
})
export class Icono {
  @Input() nombre: 'instagram' | 'discord' | 'twitter' | 'x' | 'buscar' | 'user' | 'bell' | 'heart' | 'calendar' | 'map-pin' | 'users' | 'sol' | 'luna' | 'email' | 'menu' = 'buscar';
  @Input() tamano: 'sm' | 'md' | 'lg' = 'md';

  /** Mapeo de nombres personalizados a nombres de iconos Lucide */
  private readonly MAPEO_ICONOS: Record<string, string> = {
    instagram: 'Instagram',
    discord: 'MessageCircle',
    twitter: 'Twitter',
    x: 'X',
    buscar: 'Search',
    user: 'User',
    bell: 'Bell',
    heart: 'Heart',
    calendar: 'Calendar',
    'map-pin': 'MapPin',
    users: 'Users',
    sol: 'Sun',
    luna: 'Moon',
    email: 'Mail',
    menu: 'Menu'
  };

  /** Tamaños en píxeles para cada variante */
  private readonly TAMANOS: Record<'sm' | 'md' | 'lg', number> = {
    sm: 16,
    md: 20,
    lg: 24
  };

  /** Devuelve el nombre del icono Lucide a renderizar */
  get iconoNombre(): string {
    return this.MAPEO_ICONOS[this.nombre] || 'Search';
  }

  /** Devuelve el tamaño en píxeles según la variante */
  get tamanoPixeles(): number {
    return this.TAMANOS[this.tamano];
  }
}
