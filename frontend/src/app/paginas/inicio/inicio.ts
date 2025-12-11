import { Component, inject } from '@angular/core';
import { Card } from '../../componentes/compartidos/card/card';
import { SeccionBienvenida } from '../../componentes/compartidos/seccion-bienvenida/seccion-bienvenida';
import { ModalService } from '../../servicios/modal';

// ============================================
// INTERFACES
// ============================================

interface Gimnasio {
  readonly nombre: string;
  readonly disciplina: string;
  readonly valoracion: string;
  readonly imagen: string;
}

// ============================================
// CONSTANTES - DATOS
// ============================================

const GIMNASIOS_POPULARES: readonly Gimnasio[] = [
  {
    nombre: 'Fitness Park',
    disciplina: 'Boxeo, Karate',
    valoracion: '4.3 ⭐',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
  },
  {
    nombre: 'Basic Fit',
    disciplina: 'Full Contact',
    valoracion: '3.7 ⭐',
    imagen: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop',
  },
  {
    nombre: 'Enjoy!',
    disciplina: 'Boxeo',
    valoracion: '4.6 ⭐',
    imagen: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop',
  },
] as const;

const GIMNASIOS_NUEVOS: readonly Gimnasio[] = [
  {
    nombre: 'SynerGym',
    disciplina: 'Judo, MMA',
    valoracion: 'Algeciras',
    imagen: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop',
  },
  {
    nombre: 'Smart Fit',
    disciplina: 'MMA, Boxeo',
    valoracion: 'Jerez',
    imagen: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=300&fit=crop',
  },
  {
    nombre: 'GO! Fitness',
    disciplina: 'Judo, Karate',
    valoracion: 'Cádiz',
    imagen: 'https://images.unsplash.com/photo-1570829460005-c840387bb1ca?w=400&h=300&fit=crop',
  },
] as const;

// ============================================
// COMPONENTE INICIO
// ============================================

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [Card, SeccionBienvenida],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss'],
})
export class Inicio {
  // ----------------------------------------
  // Dependencias
  // ----------------------------------------
  readonly modal = inject(ModalService);

  // ----------------------------------------
  // Datos
  // ----------------------------------------
  readonly gimnasiosPopulares: readonly Gimnasio[] = GIMNASIOS_POPULARES;
  readonly gimnasiosNuevos: readonly Gimnasio[] = GIMNASIOS_NUEVOS;
}
