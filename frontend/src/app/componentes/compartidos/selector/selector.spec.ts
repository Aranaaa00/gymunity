import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Selector, OpcionSelector } from './selector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('Selector', () => {
  let component: Selector;
  let fixture: ComponentFixture<Selector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Selector, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Selector);
    component = fixture.componentInstance;
  });

  describe('creacion', () => {
    it('deberia crearse', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('valores por defecto', () => {
    it('deberia tener label vacio', () => {
      expect(component.label()).toBe('');
    });

    it('deberia tener placeholder por defecto', () => {
      expect(component.placeholder()).toBe('Selecciona una opción');
    });

    it('deberia no ser requerido por defecto', () => {
      expect(component.required()).toBeFalse();
    });

    it('deberia no estar deshabilitado por defecto', () => {
      expect(component.disabled()).toBeFalse();
    });

    it('deberia tener opciones vacias por defecto', () => {
      expect(component.opciones().length).toBe(0);
    });

    it('deberia no tener error por defecto', () => {
      expect(component.hasError()).toBeFalse();
    });
  });

  describe('ControlValueAccessor', () => {
    it('deberia escribir valor con writeValue', () => {
      component.writeValue('opcion1');
      expect(component.value).toBe('opcion1');
    });

    it('deberia manejar null en writeValue', () => {
      component.writeValue(null as any);
      expect(component.value).toBe('');
    });

    it('deberia registrar onChange', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it('deberia registrar onTouched', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      expect(fn).not.toHaveBeenCalled();
    });

    it('deberia establecer estado deshabilitado', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toBeTrue();
    });

    it('deberia establecer estado habilitado', () => {
      component.setDisabledState(false);
      expect(component.isDisabled).toBeFalse();
    });
  });

  describe('helpers de opciones', () => {
    it('deberia obtener valor de string', () => {
      expect(component.getValorOpcion('valor1')).toBe('valor1');
    });

    it('deberia obtener valor de objeto', () => {
      const opcion: OpcionSelector = { valor: 'v1', etiqueta: 'Valor 1' };
      expect(component.getValorOpcion(opcion)).toBe('v1');
    });

    it('deberia obtener etiqueta de string', () => {
      expect(component.getEtiquetaOpcion('texto')).toBe('texto');
    });

    it('deberia obtener etiqueta de objeto', () => {
      const opcion: OpcionSelector = { valor: 'v1', etiqueta: 'Mi Etiqueta' };
      expect(component.getEtiquetaOpcion(opcion)).toBe('Mi Etiqueta');
    });

    it('deberia retornar false para string no deshabilitado', () => {
      expect(component.isOpcionDisabled('valor')).toBeFalse();
    });

    it('deberia retornar false para objeto sin disabled', () => {
      const opcion: OpcionSelector = { valor: 'v1', etiqueta: 'Etiqueta' };
      expect(component.isOpcionDisabled(opcion)).toBeFalse();
    });

    it('deberia retornar true para objeto deshabilitado', () => {
      const opcion: OpcionSelector = { valor: 'v1', etiqueta: 'Etiqueta', disabled: true };
      expect(component.isOpcionDisabled(opcion)).toBeTrue();
    });
  });

  describe('eventos', () => {
    it('deberia actualizar valor en onChangeEvent', () => {
      const mockEvento = {
        target: { value: 'opcion2' }
      } as unknown as Event;
      
      component.onChangeEvent(mockEvento);
      expect(component.value).toBe('opcion2');
    });

    it('deberia llamar onChange en onChangeEvent', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      
      const mockEvento = {
        target: { value: 'seleccion' }
      } as unknown as Event;
      
      component.onChangeEvent(mockEvento);
      expect(fn).toHaveBeenCalledWith('seleccion');
    });

    it('deberia emitir cambio en onChangeEvent', () => {
      spyOn(component.cambio, 'emit');
      
      const mockEvento = {
        target: { value: 'nuevo' }
      } as unknown as Event;
      
      component.onChangeEvent(mockEvento);
      expect(component.cambio.emit).toHaveBeenCalledWith('nuevo');
    });

    it('deberia llamar onTouched en onBlur', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      
      component.onBlur();
      expect(fn).toHaveBeenCalled();
    });
  });
});
