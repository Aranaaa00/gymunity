import { FormControl, FormGroup } from '@angular/forms';
import { 
  passwordFuerte, 
  coincidenCampos, 
  nifValido, 
  telefonoEspanol, 
  codigoPostalEspanol, 
  rangoNumerico 
} from './validadores';

describe('Validadores', () => {
  
  describe('passwordFuerte', () => {
    const validator = passwordFuerte();

    it('deberia aceptar password fuerte', () => {
      const control = new FormControl('Password1@');
      expect(validator(control)).toBeNull();
    });

    it('deberia rechazar password sin mayuscula', () => {
      const control = new FormControl('password1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia rechazar password sin minuscula', () => {
      const control = new FormControl('PASSWORD1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia rechazar password sin numero', () => {
      const control = new FormControl('Password@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia rechazar password sin caracter especial', () => {
      const control = new FormControl('Password1');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia rechazar password corta', () => {
      const control = new FormControl('Pa1@');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia rechazar password vacia', () => {
      const control = new FormControl('');
      expect(validator(control)).toEqual({ passwordFuerte: true });
    });

    it('deberia aceptar diferentes caracteres especiales', () => {
      expect(validator(new FormControl('Password1!'))).toBeNull();
      expect(validator(new FormControl('Password1%'))).toBeNull();
      expect(validator(new FormControl('Password1*'))).toBeNull();
      expect(validator(new FormControl('Password1?'))).toBeNull();
      expect(validator(new FormControl('Password1&'))).toBeNull();
      expect(validator(new FormControl('Password1.'))).toBeNull();
    });

    it('deberia aceptar exactamente 8 caracteres', () => {
      expect(validator(new FormControl('Pass1@ab'))).toBeNull();
    });

    it('deberia aceptar passwords muy largas', () => {
      expect(validator(new FormControl('Password1@ExtraLongSecure'))).toBeNull();
    });
  });

  describe('coincidenCampos', () => {
    it('deberia pasar cuando campos coinciden', () => {
      const form = new FormGroup({
        password: new FormControl('test123'),
        confirmar: new FormControl('test123')
      });
      
      const validator = coincidenCampos('password', 'confirmar');
      expect(validator(form)).toBeNull();
    });

    it('deberia fallar cuando campos no coinciden', () => {
      const form = new FormGroup({
        password: new FormControl('test123'),
        confirmar: new FormControl('diferente')
      });
      
      const validator = coincidenCampos('password', 'confirmar');
      expect(validator(form)).toEqual({ passwordMismatch: true });
    });

    it('deberia retornar null si controles no existen', () => {
      const form = new FormGroup({});
      const validator = coincidenCampos('inexistente1', 'inexistente2');
      expect(validator(form)).toBeNull();
    });

    it('deberia funcionar con campos vacios iguales', () => {
      const form = new FormGroup({
        password: new FormControl(''),
        confirmar: new FormControl('')
      });
      
      const validator = coincidenCampos('password', 'confirmar');
      expect(validator(form)).toBeNull();
    });
  });

  describe('nifValido', () => {
    const validator = nifValido();

    it('deberia aceptar NIF valido', () => {
      const control = new FormControl('12345678Z');
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar NIF valido en minusculas', () => {
      const control = new FormControl('12345678z');
      expect(validator(control)).toBeNull();
    });

    it('deberia rechazar NIF con letra incorrecta', () => {
      const control = new FormControl('12345678A');
      expect(validator(control)).toEqual({ nifInvalido: true });
    });

    it('deberia rechazar NIF con formato invalido', () => {
      const control = new FormControl('1234567ZZ');
      expect(validator(control)).toEqual({ nifInvalido: true });
    });

    it('deberia aceptar valor vacio', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('deberia validar multiples NIFs validos', () => {
      expect(validator(new FormControl('00000000T'))).toBeNull();
      expect(validator(new FormControl('99999999R'))).toBeNull();
    });

    it('deberia manejar NIF con espacios', () => {
      const control = new FormControl(' 12345678Z ');
      expect(validator(control)).toBeNull();
    });

    it('deberia rechazar NIF con longitud incorrecta', () => {
      expect(validator(new FormControl('1234567Z'))).toEqual({ nifInvalido: true });
      expect(validator(new FormControl('123456789Z'))).toEqual({ nifInvalido: true });
    });
  });

  describe('telefonoEspanol', () => {
    const validator = telefonoEspanol();

    it('deberia aceptar numero movil valido', () => {
      const control = new FormControl('612345678');
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar numero con prefijo +34', () => {
      const control = new FormControl('+34612345678');
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar numero fijo', () => {
      const control = new FormControl('912345678');
      expect(validator(control)).toBeNull();
    });

    it('deberia rechazar numero invalido', () => {
      const control = new FormControl('123456');
      expect(validator(control)).toEqual({ telefonoInvalido: true });
    });

    it('deberia aceptar valor vacio', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar diferentes prefijos', () => {
      expect(validator(new FormControl('0034612345678'))).toBeNull();
      expect(validator(new FormControl('34612345678'))).toBeNull();
    });

    it('deberia aceptar numeros que empiezan con 7, 8, 9', () => {
      expect(validator(new FormControl('712345678'))).toBeNull();
      expect(validator(new FormControl('812345678'))).toBeNull();
      expect(validator(new FormControl('912345678'))).toBeNull();
    });

    it('deberia rechazar numeros con caracteres no numericos', () => {
      expect(validator(new FormControl('61234567a'))).toEqual({ telefonoInvalido: true });
    });
  });

  describe('codigoPostalEspanol', () => {
    const validator = codigoPostalEspanol();

    it('deberia aceptar codigo postal valido', () => {
      const control = new FormControl('28001');
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar valores limite', () => {
      expect(validator(new FormControl('01001'))).toBeNull();
      expect(validator(new FormControl('52999'))).toBeNull();
    });

    it('deberia rechazar codigo postal invalido', () => {
      const control = new FormControl('00000');
      expect(validator(control)).toEqual({ codigoPostalInvalido: true });
    });

    it('deberia rechazar codigo por encima del rango', () => {
      const control = new FormControl('53000');
      expect(validator(control)).toEqual({ codigoPostalInvalido: true });
    });

    it('deberia aceptar valor vacio', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('deberia rechazar codigo con letras', () => {
      expect(validator(new FormControl('2800A'))).toEqual({ codigoPostalInvalido: true });
    });

    it('deberia rechazar codigo con longitud incorrecta', () => {
      expect(validator(new FormControl('2800'))).toEqual({ codigoPostalInvalido: true });
      expect(validator(new FormControl('280011'))).toEqual({ codigoPostalInvalido: true });
    });
  });

  describe('rangoNumerico', () => {
    const validator = rangoNumerico(0, 100);

    it('deberia aceptar valor en rango', () => {
      const control = new FormControl(50);
      expect(validator(control)).toBeNull();
    });

    it('deberia aceptar valores limite', () => {
      expect(validator(new FormControl(0))).toBeNull();
      expect(validator(new FormControl(100))).toBeNull();
    });

    it('deberia rechazar valor por debajo del rango', () => {
      const control = new FormControl(-5);
      expect(validator(control)).toEqual({ rangoNumerico: { min: 0, max: 100, actual: -5 } });
    });

    it('deberia rechazar valor por encima del rango', () => {
      const control = new FormControl(150);
      expect(validator(control)).toEqual({ rangoNumerico: { min: 0, max: 100, actual: 150 } });
    });

    it('deberia rechazar valor no numerico', () => {
      const control = new FormControl('abc');
      expect(validator(control)).toEqual({ rangoNumerico: true });
    });

    it('deberia aceptar valor vacio', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('deberia funcionar con rangos negativos', () => {
      const validatorNegativo = rangoNumerico(-100, -10);
      expect(validatorNegativo(new FormControl(-50))).toBeNull();
      expect(validatorNegativo(new FormControl(-5))).toBeTruthy();
    });

    it('deberia funcionar con numeros decimales', () => {
      expect(validator(new FormControl(0.5))).toBeNull();
      expect(validator(new FormControl(99.99))).toBeNull();
    });
  });
});
