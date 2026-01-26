import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

const TITULO_BASE = 'Gymunity';
const SEPARADOR = ' | ';

@Injectable({ providedIn: 'root' })
export class TituloPagina {
  private readonly titleService = inject(Title);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  inicializar(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.obtenerTituloRuta(this.activatedRoute))
    ).subscribe((titulo) => {
      this.establecer(titulo);
    });
  }

  establecer(titulo?: string): void {
    if (titulo) {
      this.titleService.setTitle(`${titulo}${SEPARADOR}${TITULO_BASE}`);
    } else {
      this.titleService.setTitle(TITULO_BASE);
    }
  }

  private obtenerTituloRuta(route: ActivatedRoute): string {
    let child = route;
    while (child.firstChild) {
      child = child.firstChild;
    }
    
    const titulo = child.snapshot.data['titulo'] || child.snapshot.data['breadcrumb'];
    return titulo || '';
  }
}
