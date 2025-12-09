import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { X, Search, User, Bell, Heart, Calendar, MapPin, Users, Sun, Moon, Mail, Instagram, MessageCircle, Twitter, Menu } from 'lucide-angular';

// Iconos disponibles en toda la aplicación
const iconos = {
  X,
  Search,
  User,
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
  Menu
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider(iconos) }
  ]
};
