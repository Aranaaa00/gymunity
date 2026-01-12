import { Injectable } from '@angular/core';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

@Injectable({ providedIn: 'root' })
export class CacheService {
  
  private readonly cache = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }
    
    const ahora = Date.now();
    const expirado = ahora - entry.timestamp > CACHE_DURATION_MS;
    
    if (expirado) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  invalidar(prefijo?: string): void {
    if (!prefijo) {
      this.cache.clear();
      return;
    }
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefijo)) {
        this.cache.delete(key);
      }
    }
  }

  generarClave(...partes: (string | number | undefined)[]): string {
    return partes.filter(Boolean).join(':');
  }
}
