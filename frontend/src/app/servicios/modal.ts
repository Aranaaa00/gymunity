import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  modalActivo = signal<'login' | 'registro' | null>(null);

  abrirRegistro(): void {
    this.modalActivo.set('registro');
  }

  abrirLogin(): void {
    this.modalActivo.set('login');
  }

  cerrar(): void {
    this.modalActivo.set(null);
  }
}
