import { Component, inject, Signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

// ============================================
// TIPOS
// ============================================

export interface Breadcrumb {
  readonly label: string;
  readonly url: string;
}

// ============================================
// COMPONENTE
// ============================================

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly navigationEnd$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(() => this.construirBreadcrumbs(this.activatedRoute.root))
  );

  readonly breadcrumbs: Signal<Breadcrumb[]> = toSignal(this.navigationEnd$, {
    initialValue: this.construirBreadcrumbs(this.activatedRoute.root),
  });

  readonly mostrarBreadcrumbs: Signal<boolean> = computed(() => this.breadcrumbs().length > 1);

  private construirBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    if (route.children.length === 0) return breadcrumbs;

    for (const child of route.children) {
      const segmentos = child.snapshot.url.map((s) => s.path).join('/');
      
      if (segmentos) url += `/${segmentos}`;

      const label = child.snapshot.data['breadcrumb'] as string;
      
      if (label) breadcrumbs.push({ label, url });

      return this.construirBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
