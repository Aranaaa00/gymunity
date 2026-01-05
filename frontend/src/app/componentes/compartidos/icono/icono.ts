import { Component, input, computed, InputSignal, Signal, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

// ============================================
// TIPOS
// ============================================

export type NombreIcono =
  | 'instagram'
  | 'discord'
  | 'twitter'
  | 'x'
  | 'buscar'
  | 'user'
  | 'user-circle'
  | 'bell'
  | 'heart'
  | 'calendar'
  | 'map-pin'
  | 'users'
  | 'sol'
  | 'luna'
  | 'email'
  | 'menu'
  | 'chevron-down'
  | 'settings'
  | 'log-out'
  | 'plus'
  | 'search'
  | 'search-x'
  | 'loader'
  | 'construction'
  | 'sparkles'
  | 'dumbbell'
  | 'star'
  | 'wallet'
  | 'clock'
  | 'trophy'
  | 'bar-chart'
  | 'palette'
  | 'lock'
  | 'message-circle'
  | 'check'
  | 'x-circle'
  | 'alert-circle'
  | 'tag'
  | 'refresh-cw';

type TamanoIcono = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// ============================================
// CONSTANTES
// ============================================

const NOMBRE_DEFECTO: NombreIcono = 'buscar';
const TAMANO_DEFECTO: TamanoIcono = 'md';
const ICONO_FALLBACK = 'Search';

const MAPEO_ICONOS: Readonly<Record<NombreIcono, string>> = {
  instagram: 'Instagram',
  discord: 'MessageCircle',
  twitter: 'Twitter',
  x: 'X',
  buscar: 'Search',
  user: 'User',
  'user-circle': 'UserCircle',
  bell: 'Bell',
  heart: 'Heart',
  calendar: 'Calendar',
  'map-pin': 'MapPin',
  users: 'Users',
  sol: 'Sun',
  luna: 'Moon',
  email: 'Mail',
  menu: 'Menu',
  'chevron-down': 'ChevronDown',
  settings: 'Settings',
  'log-out': 'LogOut',
  plus: 'Plus',
  search: 'Search',
  'search-x': 'SearchX',
  loader: 'Loader2',
  construction: 'HardHat',
  sparkles: 'Sparkles',
  dumbbell: 'Dumbbell',
  star: 'Star',
  wallet: 'Wallet',
  clock: 'Clock',
  trophy: 'Trophy',
  'bar-chart': 'BarChart3',
  palette: 'Palette',
  lock: 'Lock',
  'message-circle': 'MessageCircle',
  check: 'Check',
  'x-circle': 'XCircle',
  'alert-circle': 'AlertCircle',
  tag: 'Tag',
  'refresh-cw': 'RefreshCw',
} as const;

const TAMANOS_PIXELES: Readonly<Record<TamanoIcono, number>> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

// ============================================
// COMPONENTE ICONO
// ============================================

@Component({
  selector: 'app-icono',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './icono.html',
  styleUrl: './icono.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icono {
  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly nombre: InputSignal<NombreIcono> = input<NombreIcono>(NOMBRE_DEFECTO);
  readonly tamano: InputSignal<TamanoIcono> = input<TamanoIcono>(TAMANO_DEFECTO);

  // ----------------------------------------
  // Señales computadas
  // ----------------------------------------
  readonly iconoNombre: Signal<string> = computed((): string => {
    const nombreActual = this.nombre();
    const iconoMapeado = MAPEO_ICONOS[nombreActual];
    const nombreFinal = iconoMapeado ?? ICONO_FALLBACK;

    return nombreFinal;
  });

  readonly tamanoPixeles: Signal<number> = computed((): number => {
    const tamanoActual = this.tamano();
    const pixeles = TAMANOS_PIXELES[tamanoActual];

    return pixeles;
  });
}
