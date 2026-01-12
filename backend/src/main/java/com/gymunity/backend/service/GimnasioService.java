package com.gymunity.backend.service;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymunity.backend.dto.ClaseDTO;
import com.gymunity.backend.dto.GimnasioCardDTO;
import com.gymunity.backend.dto.GimnasioDetalleDTO;
import com.gymunity.backend.dto.GimnasioRequestDTO;
import com.gymunity.backend.dto.ProfesorDTO;
import com.gymunity.backend.dto.ReseniaDTO;
import com.gymunity.backend.dto.TorneoDTO;
import com.gymunity.backend.entity.Gimnasio;
import com.gymunity.backend.exception.RecursoNoEncontradoException;
import com.gymunity.backend.exception.ReglaNegocioException;
import com.gymunity.backend.repository.AlumnoClaseRepository;
import com.gymunity.backend.repository.GimnasioRepository;
import com.gymunity.backend.repository.InteraccionRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class GimnasioService {

    private static final int LIMITE_DESTACADOS = 6;
    
    private final GimnasioRepository gimnasioRepository;
    private final InteraccionRepository interaccionRepository;
    private final AlumnoClaseRepository alumnoClaseRepository;

    /**
     * Obtiene todos los gimnasios como cards.
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> obtenerTodos() {
        return gimnasioRepository.findAll().stream()
                .map(this::convertirACardDTO)
                .toList();
    }

    /**
     * Obtiene un gimnasio por ID con detalle completo.
     */
    @Transactional(readOnly = true)
    public GimnasioDetalleDTO obtenerPorId(Long id) {
        return convertirADetalleDTO(buscarPorId(id));
    }

    /**
     * Obtiene gimnasios más populares.
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> obtenerPopulares() {
        return gimnasioRepository.findMasPopulares(PageRequest.of(0, LIMITE_DESTACADOS)).stream()
                .map(this::convertirACardDTO)
                .toList();
    }

    /**
     * Obtiene gimnasios más recientes.
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> obtenerRecientes() {
        return gimnasioRepository.findMasRecientes(PageRequest.of(0, LIMITE_DESTACADOS)).stream()
                .map(this::convertirACardDTO)
                .toList();
    }

    /**
     * Busca gimnasios por nombre.
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> buscarPorNombre(String nombre) {
        return gimnasioRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirACardDTO)
                .toList();
    }

    /**
     * Busca gimnasios por ciudad (ignorando mayúsculas y tildes).
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> buscarPorCiudad(String ciudad) {
        String ciudadNormalizada = normalizarTexto(ciudad);
        
        // Buscar todos los gimnasios y filtrar por ciudad normalizada
        return gimnasioRepository.findAll().stream()
                .filter(g -> normalizarTexto(g.getCiudad()).equals(ciudadNormalizada))
                .map(this::convertirACardDTO)
                .toList();
    }
    
    /**
     * Normaliza un texto quitando tildes y convirtiendo a minúsculas.
     */
    private String normalizarTexto(String texto) {
        if (texto == null) return "";
        return Normalizer.normalize(texto.toLowerCase().trim(), Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
    }

    /**
     * Busca gimnasios por arte marcial.
     */
    @Transactional(readOnly = true)
    public List<GimnasioCardDTO> buscarPorArteMarcial(String arteMarcial) {
        return gimnasioRepository.findDistinctByClasesNombreContainingIgnoreCase(arteMarcial).stream()
                .map(this::convertirACardDTO)
                .toList();
    }

    /**
     * Crea un nuevo gimnasio.
     * REGLA: No puede haber dos gimnasios con el mismo nombre en la misma ciudad.
     */
    public GimnasioCardDTO crear(GimnasioRequestDTO dto) {
        validarGimnasioUnico(dto.getNombre(), dto.getCiudad());
        
        Gimnasio gimnasio = Gimnasio.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .ciudad(dto.getCiudad())
                .foto(dto.getFoto())
                .build();
        
        return convertirACardDTO(gimnasioRepository.save(gimnasio));
    }

    /**
     * Actualiza un gimnasio existente.
     */
    public GimnasioCardDTO actualizar(Long id, GimnasioRequestDTO dto) {
        Gimnasio gimnasio = buscarPorId(id);
        
        if (!gimnasio.getNombre().equals(dto.getNombre()) || !gimnasio.getCiudad().equals(dto.getCiudad())) {
            validarGimnasioUnico(dto.getNombre(), dto.getCiudad());
        }
        
        gimnasio.setNombre(dto.getNombre());
        gimnasio.setDescripcion(dto.getDescripcion());
        gimnasio.setCiudad(dto.getCiudad());
        gimnasio.setFoto(dto.getFoto());
        
        return convertirACardDTO(gimnasioRepository.save(gimnasio));
    }

    /**
     * Elimina un gimnasio.
     * REGLA: No se puede eliminar si tiene usuarios apuntados.
     */
    public void eliminar(Long id) {
        Gimnasio gimnasio = buscarPorId(id);
        validarSinUsuariosApuntados(id);
        gimnasioRepository.delete(gimnasio);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private Gimnasio buscarPorId(Long id) {
        return gimnasioRepository.findById(id)
                .orElseThrow(() -> new RecursoNoEncontradoException("Gimnasio no encontrado con ID: " + id));
    }

    private void validarGimnasioUnico(String nombre, String ciudad) {
        if (gimnasioRepository.existsByNombreIgnoreCaseAndCiudadIgnoreCase(nombre, ciudad)) {
            throw new ReglaNegocioException("Ya existe un gimnasio llamado '" + nombre + "' en " + ciudad);
        }
    }

    private void validarSinUsuariosApuntados(Long gimnasioId) {
        if (interaccionRepository.countByGimnasioIdAndEsApuntadoTrue(gimnasioId) > 0) {
            throw new ReglaNegocioException("No se puede eliminar el gimnasio porque tiene usuarios apuntados");
        }
    }

    private String obtenerDisciplinas(Gimnasio gimnasio) {
        return gimnasio.getClases().stream()
                .map(c -> c.getNombre())
                .distinct()
                .limit(3)
                .collect(Collectors.joining(", "));
    }

    private GimnasioCardDTO convertirACardDTO(Gimnasio gimnasio) {
        return GimnasioCardDTO.builder()
                .id(gimnasio.getId())
                .nombre(gimnasio.getNombre())
                .ciudad(gimnasio.getCiudad())
                .foto(gimnasio.getFoto())
                .disciplinas(obtenerDisciplinas(gimnasio))
                .valoracionMedia(interaccionRepository.calcularValoracionMedia(gimnasio.getId()))
                .totalResenias((int) interaccionRepository.countByGimnasioIdAndReseniaIsNotNull(gimnasio.getId()))
                .build();
    }

    private GimnasioDetalleDTO convertirADetalleDTO(Gimnasio gimnasio) {
        List<ClaseDTO> clases = gimnasio.getClases().stream()
                .map(c -> ClaseDTO.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .icono(c.getIcono())
                        .profesorNombre(c.getProfesor() != null ? c.getProfesor().getNombreUsuario() : null)
                        .totalAlumnos((int) alumnoClaseRepository.countByClaseId(c.getId()))
                        .diasSemana(c.getDiasSemana())
                        .horaInicio(c.getHoraInicio())
                        .horaFin(c.getHoraFin())
                        .build())
                .toList();
        
        // Obtener profesores únicos del gimnasio
        List<ProfesorDTO> profesores = gimnasio.getClases().stream()
                .filter(c -> c.getProfesor() != null)
                .map(c -> c.getProfesor())
                .distinct()
                .map(p -> ProfesorDTO.builder()
                        .id(p.getId())
                        .nombre(p.getNombreUsuario())
                        .especialidad(gimnasio.getClases().stream()
                                .filter(c -> c.getProfesor() != null && c.getProfesor().getId().equals(p.getId()))
                                .map(c -> c.getNombre())
                                .findFirst()
                                .orElse(""))
                        .foto(p.getAvatar())
                        .valoracion(4.5) // Valoración base del gimnasio
                        .build())
                .toList();
        
        // Torneos del gimnasio (información del gimnasio, no de usuarios)
        List<TorneoDTO> torneos = List.of(
                TorneoDTO.builder()
                        .id(1L)
                        .nombre("Campeonato de " + (clases.isEmpty() ? "MMA" : clases.get(0).getNombre()))
                        .fecha(java.time.LocalDate.now().plusMonths(1))
                        .disciplina(clases.isEmpty() ? "MMA" : clases.get(0).getNombre())
                        .build(),
                TorneoDTO.builder()
                        .id(2L)
                        .nombre("Campeonato de " + (clases.size() > 1 ? clases.get(1).getNombre() : "Boxeo"))
                        .fecha(java.time.LocalDate.now().plusMonths(2))
                        .disciplina(clases.size() > 1 ? clases.get(1).getNombre() : "Boxeo")
                        .build()
        );
        
        // Fotos adicionales de galería (parte del gimnasio, no generadas por usuarios)
        List<String> fotosGaleria = List.of(
                "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=300&fit=crop"
        );
        
        List<ReseniaDTO> resenias = interaccionRepository.findByGimnasioIdAndReseniaIsNotNull(gimnasio.getId()).stream()
                .map(i -> ReseniaDTO.builder()
                        .id(i.getId())
                        .nombreUsuario(i.getUsuario().getNombreUsuario())
                        .avatarUsuario(i.getUsuario().getAvatar())
                        .texto(i.getResenia())
                        .valoracion(i.getValoracion())
                        .fecha(i.getFechaInteraccion())
                        .build())
                .toList();
        
        return GimnasioDetalleDTO.builder()
                .id(gimnasio.getId())
                .nombre(gimnasio.getNombre())
                .descripcion(gimnasio.getDescripcion())
                .ciudad(gimnasio.getCiudad())
                .foto(gimnasio.getFoto())
                .fotos(fotosGaleria)
                .valoracionMedia(interaccionRepository.calcularValoracionMedia(gimnasio.getId()))
                .totalResenias((int) interaccionRepository.countByGimnasioIdAndReseniaIsNotNull(gimnasio.getId()))
                .totalApuntados((int) interaccionRepository.countByGimnasioIdAndEsApuntadoTrue(gimnasio.getId()))
                .clases(clases)
                .profesores(profesores)
                .torneos(torneos)
                .resenias(resenias)
                .build();
    }
}
