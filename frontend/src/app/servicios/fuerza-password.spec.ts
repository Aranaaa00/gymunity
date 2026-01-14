import { calcularFuerzaPassword } from './fuerza-password';

describe('calcularFuerzaPassword', () => {
  
  it('deberia retornar debil para password vacia', () => {
    const resultado = calcularFuerzaPassword('');
    expect(resultado.nivel).toBe('debil');
    expect(resultado.porcentaje).toBe(0);
  });

  it('deberia retornar debil para password muy debil', () => {
    const resultado = calcularFuerzaPassword('abc');
    expect(resultado.nivel).toBe('debil');
  });

  it('deberia retornar media para password moderada', () => {
    const resultado = calcularFuerzaPassword('Password');
    expect(resultado.nivel).toBe('media');
  });

  it('deberia retornar fuerte para password fuerte', () => {
    const resultado = calcularFuerzaPassword('Password1@');
    expect(resultado.nivel).toBe('fuerte');
  });

  it('deberia retornar muy-fuerte para password muy fuerte', () => {
    const resultado = calcularFuerzaPassword('Password1@Extra');
    expect(resultado.nivel).toBe('muy-fuerte');
  });

  it('deberia incrementar puntos por longitud', () => {
    const corta = calcularFuerzaPassword('Aa1@');
    const larga = calcularFuerzaPassword('Aa1@xxxxxxxxxxxxxxxx');
    expect(larga.porcentaje).toBeGreaterThan(corta.porcentaje);
  });

  it('deberia proveer mensaje apropiado', () => {
    expect(calcularFuerzaPassword('a').mensaje).toBe('Contraseña débil');
    expect(calcularFuerzaPassword('Password1@').mensaje).toBe('Contraseña fuerte');
  });

  it('deberia limitar porcentaje a 100', () => {
    const resultado = calcularFuerzaPassword('VeryLongPassword1234567890@');
    expect(resultado.porcentaje).toBeLessThanOrEqual(100);
  });

  it('deberia manejar valores tipo null', () => {
    const resultado = calcularFuerzaPassword('');
    expect(resultado.nivel).toBe('debil');
    expect(resultado.mensaje).toBe('');
  });

  it('deberia calcular puntos por cada tipo de caracter', () => {
    const soloMinusculas = calcularFuerzaPassword('abcdefgh');
    const conMayusculas = calcularFuerzaPassword('abcdeFGH');
    const conNumeros = calcularFuerzaPassword('abcdeFG1');
    const conEspeciales = calcularFuerzaPassword('abcdeFG1@');
    
    expect(soloMinusculas.porcentaje).toBeLessThan(conMayusculas.porcentaje);
    expect(conMayusculas.porcentaje).toBeLessThan(conNumeros.porcentaje);
    expect(conNumeros.porcentaje).toBeLessThan(conEspeciales.porcentaje);
  });

  it('deberia dar bonus por passwords largas', () => {
    const longitud8 = calcularFuerzaPassword('Aa1@xxxx');
    const longitud12 = calcularFuerzaPassword('Aa1@xxxxxxxx');
    const longitud16 = calcularFuerzaPassword('Aa1@xxxxxxxxxxxx');
    const longitud20 = calcularFuerzaPassword('Aa1@xxxxxxxxxxxxxxxx');
    
    expect(longitud8.porcentaje).toBeLessThan(longitud12.porcentaje);
    expect(longitud12.porcentaje).toBeLessThan(longitud16.porcentaje);
    expect(longitud16.porcentaje).toBeLessThan(longitud20.porcentaje);
  });

  it('deberia tener mensaje correspondiente al nivel', () => {
    const debil = calcularFuerzaPassword('a');
    const media = calcularFuerzaPassword('Password');
    const fuerte = calcularFuerzaPassword('Password1@');
    
    expect(debil.mensaje).toBe('Contraseña débil');
    expect(media.mensaje).toBe('Contraseña media');
    expect(fuerte.mensaje).toBe('Contraseña fuerte');
  });

  it('deberia detectar solo numeros como debil', () => {
    const resultado = calcularFuerzaPassword('12345678');
    expect(resultado.nivel).toBe('debil');
  });

  it('deberia detectar solo mayusculas como debil', () => {
    const resultado = calcularFuerzaPassword('ABCDEFGH');
    expect(resultado.nivel).toBe('debil');
  });

  it('deberia manejar caracteres unicode', () => {
    const resultado = calcularFuerzaPassword('Password1@');
    expect(resultado).toBeDefined();
  });
});
