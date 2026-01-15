package com.gymunity.backend.service;

import com.gymunity.backend.dto.InscripcionResponseDTO;
import com.gymunity.backend.entity.AlumnoClase;
import com.gymunity.backend.entity.Clase;
import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.entity.Usuario;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.AlumnoClaseRepository;
import com.gymunity.backend.repository.ClaseRepository;
import com.gymunity.backend.repository.InteraccionRepository;
import com.gymunity.backend.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlumnoClaseServiceTest {

    @Mock
    private AlumnoClaseRepository alumnoClaseRepository;
    
    @Mock
    private UsuarioRepository usuarioRepository;
    
    @Mock
    private ClaseRepository claseRepository;
    
    @Mock
    private InteraccionRepository interaccionRepository;
    
    @InjectMocks
    private AlumnoClaseService alumnoClaseService;

    private static final LocalDateTime FECHA_FUTURA = LocalDateTime.now().plusDays(7);
    
    @Test
    void inscribir_UsuarioNoExiste_LanzaExcepcion() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(999L, 1L, FECHA_FUTURA))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("Usuario no encontrado con ID: 999");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_UsuarioNoEsAlumno_LanzaExcepcion() {
        Usuario profesor = Usuario.builder()
                .id(1L)
                .rol(Rol.PROFESOR)
                .build();
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(profesor));
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L, FECHA_FUTURA))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("Solo los usuarios con rol ALUMNO pueden inscribirse en clases");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_ClaseNoExiste_LanzaExcepcion() {
        Usuario alumno = Usuario.builder()
                .id(1L)
                .rol(Rol.ALUMNO)
                .build();
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(claseRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 999L, FECHA_FUTURA))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("Clase no encontrada con ID: 999");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_AlumnoYaInscritoEnFecha_LanzaExcepcion() {
        Usuario alumno = Usuario.builder()
                .id(1L)
                .rol(Rol.ALUMNO)
                .build();
        
        Gimnasio gimnasio = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .build();
        
        Clase clase = Clase.builder()
                .id(1L)
                .nombre("Clase Test")
                .gimnasio(gimnasio)
                .build();
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(claseRepository.findById(1L)).thenReturn(Optional.of(clase));
        when(alumnoClaseRepository.existsByAlumnoIdAndClaseIdAndFechaClase(1L, 1L, FECHA_FUTURA)).thenReturn(true);
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L, FECHA_FUTURA))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("Ya estás inscrito en esta clase para esa fecha");
        
        verify(alumnoClaseRepository, never()).save(any());
    }

    @Test
    void inscribir_FechaPasada_LanzaExcepcion() {
        Usuario alumno = Usuario.builder()
                .id(1L)
                .rol(Rol.ALUMNO)
                .build();
        
        Gimnasio gimnasio = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .build();
        
        Clase clase = Clase.builder()
                .id(1L)
                .nombre("Clase Test")
                .gimnasio(gimnasio)
                .build();
        
        LocalDateTime fechaPasada = LocalDateTime.now().minusDays(1);
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(claseRepository.findById(1L)).thenReturn(Optional.of(clase));
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L, fechaPasada))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("La fecha de la clase debe ser futura");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_Exitoso() {
        Usuario alumno = Usuario.builder()
                .id(1L)
                .nombreUsuario("Juan")
                .rol(Rol.ALUMNO)
                .build();
        
        Gimnasio gimnasio = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .build();
        
        Clase clase = Clase.builder()
                .id(1L)
                .nombre("Clase Test")
                .gimnasio(gimnasio)
                .build();
        
        AlumnoClase inscripcion = AlumnoClase.builder()
                .id(1L)
                .alumno(alumno)
                .clase(clase)
                .fechaClase(FECHA_FUTURA)
                .build();
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(claseRepository.findById(1L)).thenReturn(Optional.of(clase));
        when(alumnoClaseRepository.existsByAlumnoIdAndClaseIdAndFechaClase(1L, 1L, FECHA_FUTURA)).thenReturn(false);
        when(alumnoClaseRepository.save(any(AlumnoClase.class))).thenReturn(inscripcion);
        
        InscripcionResponseDTO resultado = alumnoClaseService.inscribir(1L, 1L, FECHA_FUTURA);
        
        assertThat(resultado).isNotNull();
        assertThat(resultado.getAlumnoId()).isEqualTo(1L);
        assertThat(resultado.getClaseId()).isEqualTo(1L);
        verify(alumnoClaseRepository).save(any(AlumnoClase.class));
    }
}
