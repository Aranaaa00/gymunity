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
    
    @Test
    void inscribir_UsuarioNoExiste_LanzaExcepcion() {
        when(usuarioRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(999L, 1L))
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
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L))
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
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 999L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("Clase no encontrada con ID: 999");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_AlumnoYaInscrito_LanzaExcepcion() {
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
        when(alumnoClaseRepository.existsByAlumnoIdAndClaseId(1L, 1L)).thenReturn(true);
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("El alumno ya está inscrito en esta clase");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_AlumnoNoApuntadoAlGimnasio_LanzaExcepcion() {
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
        when(alumnoClaseRepository.existsByAlumnoIdAndClaseId(1L, 1L)).thenReturn(false);
        when(interaccionRepository.estaApuntado(1L, 1L)).thenReturn(false);
        
        assertThatThrownBy(() -> alumnoClaseService.inscribir(1L, 1L))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("Debes apuntarte al gimnasio antes de inscribirte en sus clases");
        
        verify(alumnoClaseRepository, never()).save(any());
    }
    
    @Test
    void inscribir_ExitosoCuandoApuntado() {
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
                .build();
        
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));
        when(claseRepository.findById(1L)).thenReturn(Optional.of(clase));
        when(alumnoClaseRepository.existsByAlumnoIdAndClaseId(1L, 1L)).thenReturn(false);
        when(interaccionRepository.estaApuntado(1L, 1L)).thenReturn(true);
        when(alumnoClaseRepository.findByAlumnoId(1L)).thenReturn(java.util.Collections.emptyList());
        when(alumnoClaseRepository.save(any(AlumnoClase.class))).thenReturn(inscripcion);
        
        InscripcionResponseDTO resultado = alumnoClaseService.inscribir(1L, 1L);
        
        assertThat(resultado).isNotNull();
        assertThat(resultado.getAlumnoId()).isEqualTo(1L);
        assertThat(resultado.getClaseId()).isEqualTo(1L);
        verify(alumnoClaseRepository).save(any(AlumnoClase.class));
    }
}
