import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardImage } from './card-image';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CardImage],
  template: `
    <app-card-image
      [src]="src"
      [alt]="alt"
      [variant]="variant"
    />
  `
})
class TestHostComponent {
  src = '/test-image.jpg';
  alt = 'Imagen de test';
  variant: 'vertical' | 'horizontal' = 'vertical';
}

describe('CardImage', () => {
  let component: CardImage;
  let fixture: ComponentFixture<CardImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardImage, TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardImage);
    component = fixture.componentInstance;
  });

  describe('creacion', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('valores por defecto', () => {
    it('deberia tener src vacio', () => {
      expect(component.src()).toBe('');
    });

    it('deberia tener alt vacio', () => {
      expect(component.alt()).toBe('');
    });

    it('deberia tener variant vertical por defecto', () => {
      expect(component.variant()).toBe('vertical');
    });

    it('deberia no tener error de imagen', () => {
      expect(component.imageError()).toBeFalse();
    });
  });

  describe('onImageError', () => {
    it('deberia establecer imageError a true', () => {
      component.onImageError();
      expect(component.imageError()).toBeTrue();
    });

    it('deberia mantener error despues de llamadas multiples', () => {
      component.onImageError();
      component.onImageError();
      expect(component.imageError()).toBeTrue();
    });
  });

  describe('con TestHost', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('deberia recibir src del host', () => {
      const cardImage = hostFixture.debugElement.children[0].componentInstance as CardImage;
      expect(cardImage.src()).toBe('/test-image.jpg');
    });

    it('deberia recibir alt del host', () => {
      const cardImage = hostFixture.debugElement.children[0].componentInstance as CardImage;
      expect(cardImage.alt()).toBe('Imagen de test');
    });

    it('deberia cambiar variant', () => {
      hostComponent.variant = 'horizontal';
      hostFixture.detectChanges();
      
      const cardImage = hostFixture.debugElement.children[0].componentInstance as CardImage;
      expect(cardImage.variant()).toBe('horizontal');
    });
  });
});
