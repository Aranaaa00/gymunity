import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaTexto } from './area-texto';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AreaTexto', () => {
  let component: AreaTexto;
  let fixture: ComponentFixture<AreaTexto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaTexto, FormsModule, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaTexto);
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

    it('deberia tener inputId vacio', () => {
      expect(component.inputId()).toBe('');
    });

    it('deberia tener placeholder vacio', () => {
      expect(component.placeholder()).toBe('');
    });

    it('deberia no ser requerido por defecto', () => {
      expect(component.required()).toBeFalse();
    });

    it('deberia no estar deshabilitado por defecto', () => {
      expect(component.disabled()).toBeFalse();
    });

    it('deberia tener 4 filas por defecto', () => {
      expect(component.rows()).toBe(4);
    });

    it('deberia tener maxlength null por defecto', () => {
      expect(component.maxlength()).toBeNull();
    });

    it('deberia no tener error por defecto', () => {
      expect(component.hasError()).toBeFalse();
    });
  });

  describe('ControlValueAccessor', () => {
    it('deberia escribir valor con writeValue', () => {
      component.writeValue('texto de prueba');
      expect(component.value).toBe('texto de prueba');
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

  describe('eventos', () => {
    it('deberia actualizar valor en onInput', () => {
      const mockEvento = {
        target: { value: 'nuevo valor' }
      } as unknown as Event;
      
      component.onInput(mockEvento);
      expect(component.value).toBe('nuevo valor');
    });

    it('deberia llamar onChange en onInput', () => {
      const fn = jasmine.createSpy('onChange');
      component.registerOnChange(fn);
      
      const mockEvento = {
        target: { value: 'test' }
      } as unknown as Event;
      
      component.onInput(mockEvento);
      expect(fn).toHaveBeenCalledWith('test');
    });

    it('deberia emitir blur en onBlurEvent', () => {
      spyOn(component.blur, 'emit');
      
      const mockEvento = {
        target: { value: 'valor blur' }
      } as unknown as Event;
      
      component.onBlurEvent(mockEvento);
      expect(component.blur.emit).toHaveBeenCalledWith('valor blur');
    });

    it('deberia llamar onTouched en onBlurEvent', () => {
      const fn = jasmine.createSpy('onTouched');
      component.registerOnTouched(fn);
      
      const mockEvento = {
        target: { value: 'test' }
      } as unknown as Event;
      
      component.onBlurEvent(mockEvento);
      expect(fn).toHaveBeenCalled();
    });
  });
});
