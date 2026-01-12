import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutos
const STORAGE_PREFIX = 'gymunity_cache_';

@Injectable({ providedIn: 'root' })
export class CacheService {
  
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  constructor() {
    this.cargarDesdeStorage();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }
    
    const ahora = Date.now();
    const expirado = ahora - entry.timestamp > CACHE_DURATION_MS;
    
    if (expirado) {
      this.cache.delete(key);
      this.eliminarDeStorage(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    const entry = {
      data,
      timestamp: Date.now()
    };
    this.cache.set(key, entry);
    this.guardarEnStorage(key, entry);
  }

  invalidar(prefijo?: string): void {
    if (!prefijo) {
      this.cache.clear();
      this.limpiarStorage();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefijo)) {
        this.cache.delete(key);
        this.eliminarDeStorage(key);
      }
    }
  }

  generarClave(...partes: (string | number | undefined)[]): string {
    return partes.filter(Boolean).join(':');
  }

  private cargarDesdeStorage(): void {
    try {
      const ahora = Date.now();
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          const cacheKey = key.slice(STORAGE_PREFIX.length);
          const valor = sessionStorage.getItem(key);
          if (valor) {
            const entry = JSON.parse(valor) as CacheEntry<unknown>;
            const expirado = ahora - entry.timestamp > CACHE_DURATION_MS;
            if (!expirado) {
              this.cache.set(cacheKey, entry);
            } else {
              sessionStorage.removeItem(key);
            }
          }
        }
      }
    } catch {
      // Ignorar errores de storage
    }
  }

  private guardarEnStorage(key: string, entry: CacheEntry<unknown>): void {
    try {
      sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Ignorar errores de storage lleno
    }
  }

  private eliminarDeStorage(key: string): void {
    try {
      sessionStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignorar errores
    }
  }

  private limpiarStorage(): void {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    } catch {
      // Ignorar errores
    }
  }
}
