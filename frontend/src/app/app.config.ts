import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  X, Search, User, UserCircle, Bell, Heart, Calendar, MapPin, Users, Sun, Moon, Mail,
  Instagram, MessageCircle, Twitter, Menu, LoaderCircle, ChevronDown, Plus, Dumbbell,
  Settings, LogOut, HardHat, Sparkles, Star, Wallet, Clock, Trophy, BarChart3, Palette,
  Lock, Check, XCircle, Loader2, AlertCircle, Tag, RefreshCw, Award, Medal, Target,
  Flame, Zap, Shield, Crown, Gem, CheckCircle, Hourglass, Pencil, Swords, Hand,
  Footprints, PersonStanding, Activity, SearchX, Sword
} from 'lucide-angular';
import { httpHeadersInterceptor } from './interceptors/http-headers.interceptor';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { httpLoggingInterceptor } from './interceptors/http-logging.interceptor';
import { IdlePreloadStrategy } from './servicios/idle-preload-strategy';

// ============================================
// ICONOS
// ============================================

const iconos = {
  X,
  Search,
  User,
  UserCircle,
  Bell,
  Heart,
  Calendar,
  MapPin,
  Users,
  Sun,
  Moon,
  Mail,
  Instagram,
  MessageCircle,
  Twitter,
  Menu,
  LoaderCircle,
  ChevronDown,
  Plus,
  Dumbbell,
  Settings,
  LogOut,
  HardHat,
  Sparkles,
  Star,
  Wallet,
  Clock,
  Trophy,
  BarChart3,
  Palette,
  Lock,
  Check,
  XCircle,
  Loader2,
  AlertCircle,
  Tag,
  RefreshCw,
  Award,
  Medal,
  Target,
  Flame,
  Zap,
  Shield,
  Crown,
  Gem,
  CheckCircle,
  Hourglass,
  Pencil,
  Swords,
  Hand,
  Footprints,
  PersonStanding,
  Activity,
  SearchX,
  Sword,
};

// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ============================================

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(IdlePreloadStrategy)),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        httpLoggingInterceptor,
        httpHeadersInterceptor,
        httpErrorInterceptor
      ])
    ),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(iconos) }
  ]
};
