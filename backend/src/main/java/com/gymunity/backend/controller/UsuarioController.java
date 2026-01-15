package com.gymunity.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.gymunity.backend.dto.CambioContraseniaDTO;
import com.gymunity.backend.dto.UsuarioActualizacionDTO;
import com.gymunity.backend.dto.UsuarioRegistroDTO;
import com.gymunity.backend.dto.UsuarioResponseDTO;
import com.gymunity.backend.entity.Rol;
import com.gymunity.backend.service.UsuarioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @GetMapping("/rol/{rol}")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerPorRol(@PathVariable String rol) {
        return ResponseEntity.ok(usuarioService.obtenerPorRol(Rol.valueOf(rol.toUpperCase())));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> registrar(@Valid @RequestBody UsuarioRegistroDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> actualizar(@PathVariable Long id, 
                                                         @Valid @RequestBody UsuarioActualizacionDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizarPerfil(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> cambiarContrasenia(@PathVariable Long id,
                                                    @Valid @RequestBody CambioContraseniaDTO dto) {
        usuarioService.cambiarContrasenia(id, dto.getContraseniaActual(), dto.getContraseniaNueva());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verificar/email/{email}")
    public ResponseEntity<Boolean> verificarEmail(@PathVariable String email) {
        return ResponseEntity.ok(usuarioService.existeEmail(email));
    }

    @GetMapping("/verificar/username/{username}")
    public ResponseEntity<Boolean> verificarUsername(@PathVariable String username) {
        return ResponseEntity.ok(usuarioService.existeUsername(username));
    }

    @GetMapping("/verificar/ciudad/{ciudad}")
    public ResponseEntity<java.util.Map<String, Object>> verificarCiudad(@PathVariable String ciudad) {
        try {
            // Buscar solo en España con countrycodes=es
            String url = String.format(
                "https://nominatim.openstreetmap.org/search?q=%s&format=json&addressdetails=1&limit=10&accept-language=es&countrycodes=es",
                java.net.URLEncoder.encode(ciudad, java.nio.charset.StandardCharsets.UTF_8)
            );
            
            RestTemplate restTemplate = new RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "Gymunity/1.0 (https://gymunity.com)");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                List.class
            );
            
            List<java.util.Map<String, Object>> resultados = response.getBody();
            if (resultados == null || resultados.isEmpty()) {
                return ResponseEntity.ok(java.util.Map.of("existe", false, "nombre", ""));
            }
            
            String ciudadNormalizada = java.text.Normalizer
                .normalize(ciudad.toLowerCase().trim(), java.text.Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
            
            // Tipos válidos de lugares (ciudades, pueblos, villas)
            java.util.Set<String> tiposValidos = java.util.Set.of("city", "town", "village", "municipality");
            
            // Buscar la ciudad en España y devolver su nombre correcto
            for (java.util.Map<String, Object> r : resultados) {
                String addressType = (String) r.get("addresstype");
                String nombre = (String) r.get("name");
                
                // Verificar que tiene los campos necesarios
                if (nombre == null || addressType == null) continue;
                
                // Verificar que es un tipo de lugar válido
                if (!tiposValidos.contains(addressType)) continue;
                
                // Verificar que es de España (doble comprobación)
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> address = (java.util.Map<String, Object>) r.get("address");
                if (address != null) {
                    String countryCode = (String) address.get("country_code");
                    if (countryCode != null && !"es".equals(countryCode)) continue;
                }
                
                String nombreNormalizado = java.text.Normalizer
                    .normalize(nombre.toLowerCase().trim(), java.text.Normalizer.Form.NFD)
                    .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
                
                if (nombreNormalizado.equals(ciudadNormalizada)) {
                    // Devolver el nombre correcto CON tildes
                    return ResponseEntity.ok(java.util.Map.of("existe", true, "nombre", nombre));
                }
            }
            
            return ResponseEntity.ok(java.util.Map.of("existe", false, "nombre", ""));
        } catch (Exception e) {
            // En caso de error de conexión, devolver false para que el usuario corrija
            return ResponseEntity.ok(java.util.Map.of("existe", false, "nombre", ""));
        }
    }
}
