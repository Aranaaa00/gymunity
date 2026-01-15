package com.gymunity.backend.service;

import com.gymunity.backend.dto.GimnasioRequestDTO;
import com.gymunity.backend.dto.GimnasioCardDTO;
import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.GimnasioRepository;
import com.gymunity.backend.repository.InteraccionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GimnasioServiceTest {

    @Mock
    private GimnasioRepository gimnasioRepository;
    
    @Mock
    private InteraccionRepository interaccionRepository;
    
    @InjectMocks
    private GimnasioService gimnasioService;
    
    @Test
    void crear_GimnasioNuevo_CreaExitosamente() {
        GimnasioRequestDTO dto = GimnasioRequestDTO.builder()
                .nombre("Gimnasio Test")
                .descripcion("Descripción test")
                .ciudad("Madrid")
                .foto("foto.jpg")
                .build();
        
        Gimnasio gimnasioGuardado = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .descripcion("Descripción test")
                .ciudad("Madrid")
                .foto("foto.jpg")
                .build();
        
        when(gimnasioRepository.save(any(Gimnasio.class))).thenReturn(gimnasioGuardado);
        
        GimnasioCardDTO resultado = gimnasioService.crear(dto);
        
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Gimnasio Test");
        assertThat(resultado.getCiudad()).isEqualTo("Madrid");
        verify(gimnasioRepository).save(any(Gimnasio.class));
    }
    
    @Test
    void crear_GimnasioDuplicado_LanzaExcepcion() {
        GimnasioRequestDTO dto = GimnasioRequestDTO.builder()
                .nombre("Gimnasio Duplicado")
                .ciudad("Madrid")
                .build();
        
        when(gimnasioRepository.existsByNombreIgnoreCaseAndCiudadIgnoreCase("Gimnasio Duplicado", "Madrid")).thenReturn(true);
        
        assertThatThrownBy(() -> gimnasioService.crear(dto))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("Ya existe un gimnasio llamado 'Gimnasio Duplicado' en Madrid");
        
        verify(gimnasioRepository, never()).save(any(Gimnasio.class));
    }
    
    @Test
    void eliminar_GimnasioConUsuariosApuntados_LanzaExcepcion() {
        Gimnasio gimnasio = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .ciudad("Madrid")
                .build();
        
        when(gimnasioRepository.findById(1L)).thenReturn(Optional.of(gimnasio));
        when(interaccionRepository.countByGimnasioIdAndEsApuntadoTrue(1L)).thenReturn(5L);
        
        assertThatThrownBy(() -> gimnasioService.eliminar(1L))
                .isInstanceOf(ReglaNegocioException.class)
                .hasMessageContaining("No se puede eliminar el gimnasio porque tiene usuarios apuntados");
        
        verify(gimnasioRepository, never()).delete(any(Gimnasio.class));
    }
    
    @Test
    void eliminar_GimnasioSinUsuarios_EliminaExitosamente() {
        Gimnasio gimnasio = Gimnasio.builder()
                .id(1L)
                .nombre("Gimnasio Test")
                .ciudad("Madrid")
                .build();
        
        when(gimnasioRepository.findById(1L)).thenReturn(Optional.of(gimnasio));
        when(interaccionRepository.countByGimnasioIdAndEsApuntadoTrue(1L)).thenReturn(0L);
        
        gimnasioService.eliminar(1L);
        
        verify(gimnasioRepository).delete(gimnasio);
    }
    
    @Test
    void obtenerPorId_GimnasioNoExiste_LanzaExcepcion() {
        when(gimnasioRepository.findById(999L)).thenReturn(Optional.empty());
        
        assertThatThrownBy(() -> gimnasioService.obtenerPorId(999L))
                .isInstanceOf(RecursoNoEncontradoException.class)
                .hasMessageContaining("Gimnasio no encontrado con ID: 999");
    }
}
