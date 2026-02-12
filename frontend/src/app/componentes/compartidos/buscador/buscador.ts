import { Component, input, output, signal, inject, InputSignal, OutputEmitterRef, OnInit, OnDestroy, ChangeDetectionStrategy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, fromEvent, debounceTime, takeUntil, distinctUntilChanged, filter } from 'rxjs';
import { Icono } from '../icono/icono';

// ============================================
// CONSTANTES
// ============================================

const PLACEHOLDER_DEFECTO = 'Buscar...';
const DEBOUNCE_MS = 300;
const MIN_CARACTERES = 2;

let contadorInstancias = 0;

// ============================================
// COMPONENTE BUSCADOR
// ============================================

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule, Icono],
  templateUrl: './buscador.html',
  styleUrl: './buscador.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Buscador implements OnInit, OnDestroy, AfterViewInit {
  // ----------------------------------------
  // ViewChild
  // ----------------------------------------
  @ViewChild('inputBusqueda') inputBusqueda!: ElementRef<HTMLInputElement>;

  // ----------------------------------------
  // Inputs
  // ----------------------------------------
  readonly placeholder: InputSignal<string> = input<string>(PLACEHOLDER_DEFECTO);
  readonly debounceMs: InputSignal<number> = input<number>(DEBOUNCE_MS);
  readonly minCaracteres: InputSignal<number> = input<number>(MIN_CARACTERES);
  readonly expandido: InputSignal<boolean> = input<boolean>(false);

  // ----------------------------------------
  // Outputs
  // ----------------------------------------
  readonly buscar: OutputEmitterRef<string> = output<string>();
  readonly buscarConDebounce: OutputEmitterRef<string> = output<string>();

  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  private readonly router = inject(Router);
  private readonly destruir$ = new Subject<void>();

  // ----------------------------------------
  // Estado
  // ----------------------------------------
  readonly valor = signal<string>('');
  readonly errorValidacion = signal<string>('');
  readonly idUnico = signal<string>('');

  constructor() {
    contadorInstancias++;
    this.idUnico.set(`buscador-gimnasios-${contadorInstancias}`);
  }

  // ----------------------------------------
  // Lifecycle
  // ----------------------------------------
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.configurarDebounce();
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }

  // ----------------------------------------
  // Métodos públicos
  // ----------------------------------------
  onBuscar(): void {
    const terminoBusqueda = this.valor();
    
    // Validación: identificar valores erróneos y notificar al usuario
    if (terminoBusqueda.trim().length === 0) {
      this.errorValidacion.set('Introduce un término de búsqueda para encontrar gimnasios.');
      return;
    }

    if (terminoBusqueda.trim().length < this.minCaracteres()) {
      this.errorValidacion.set(`El término de búsqueda debe tener al menos ${this.minCaracteres()} caracteres. Prueba con el nombre de un gimnasio o una ciudad.`);
      return;
    }

    this.errorValidacion.set('');
    this.buscar.emit(terminoBusqueda);
    this.navegarABusqueda(terminoBusqueda);
  }

  onValorCambia(nuevoValor: string): void {
    this.valor.set(nuevoValor);
    // Limpiar error de validación cuando el usuario corrige el valor
    if (this.errorValidacion() && nuevoValor.trim().length >= this.minCaracteres()) {
      this.errorValidacion.set('');
    }
  }

  // ----------------------------------------
  // Métodos privados
  // ----------------------------------------
  private configurarDebounce(): void {
    if (!this.inputBusqueda) {
      return;
    }

    fromEvent<InputEvent>(this.inputBusqueda.nativeElement, 'input').pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged(),
      filter(() => {
        const valorActual = this.valor();
        return valorActual.length >= this.minCaracteres() || valorActual.length === 0;
      }),
      takeUntil(this.destruir$)
    ).subscribe(() => {
      this.buscarConDebounce.emit(this.valor());
    });
  }

  private navegarABusqueda(termino: string): void {
    const terminoLimpio = termino.trim();
    
    if (!terminoLimpio) {
      return;
    }
    
    this.router.navigate(['/busqueda'], {
      queryParams: { q: terminoLimpio }
    });

    // Limpiar el buscador después de navegar
    this.valor.set('');
    if (this.inputBusqueda) {
      this.inputBusqueda.nativeElement.value = '';
    }
  }

  limpiar(): void {
    this.valor.set('');
    if (this.inputBusqueda) {
      this.inputBusqueda.nativeElement.value = '';
    }
  }
}


