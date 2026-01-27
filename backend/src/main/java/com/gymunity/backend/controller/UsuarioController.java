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
            // Decodificar por si viene codificado (ej: M%C3%A1laga -> Málaga)
            String ciudadDecodificada = java.net.URLDecoder.decode(ciudad, java.nio.charset.StandardCharsets.UTF_8);
            
            // Buscar solo en España con countrycodes=es
            String url = String.format(
                "https://nominatim.openstreetmap.org/search?q=%s&format=json&addressdetails=1&limit=10&accept-language=es&countrycodes=es",
                java.net.URLEncoder.encode(ciudadDecodificada, java.nio.charset.StandardCharsets.UTF_8)
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
            
            // Normalizar entrada del usuario (quitar tildes para comparar)
            String ciudadNormalizada = java.text.Normalizer
                .normalize(ciudadDecodificada.toLowerCase().trim(), java.text.Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
            
            // Tipos válidos de lugares (ampliado)
            java.util.Set<String> tiposValidos = java.util.Set.of(
                "city", "town", "village", "municipality", 
                "administrative", "boundary", "place", "suburb"
            );
            
            // Buscar en los resultados
            for (java.util.Map<String, Object> r : resultados) {
                String addressType = (String) r.get("addresstype");
                String type = (String) r.get("type");
                String classType = (String) r.get("class");
                
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> address = (java.util.Map<String, Object>) r.get("address");
                
                // Verificar que es de España
                if (address == null) continue;
                String countryCode = (String) address.get("country_code");
                if (!"es".equals(countryCode)) continue;
                
                // Obtener el nombre de la ciudad desde address (más fiable)
                String nombreCiudad = null;
                if (address.get("city") != null) {
                    nombreCiudad = (String) address.get("city");
                } else if (address.get("town") != null) {
                    nombreCiudad = (String) address.get("town");
                } else if (address.get("village") != null) {
                    nombreCiudad = (String) address.get("village");
                } else if (address.get("municipality") != null) {
                    nombreCiudad = (String) address.get("municipality");
                } else if (tiposValidos.contains(addressType) || tiposValidos.contains(type) || "place".equals(classType) || "boundary".equals(classType)) {
                    nombreCiudad = (String) r.get("name");
                }
                
                if (nombreCiudad == null) continue;
                
                // Normalizar nombre encontrado
                String nombreNormalizado = java.text.Normalizer
                    .normalize(nombreCiudad.toLowerCase().trim(), java.text.Normalizer.Form.NFD)
                    .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
                
                // Comparar sin tildes
                if (nombreNormalizado.equals(ciudadNormalizada)) {
                    // Devolver el nombre correcto CON tildes de la API
                    return ResponseEntity.ok(java.util.Map.of("existe", true, "nombre", nombreCiudad));
                }
            }
            
            // Segunda pasada: buscar coincidencia parcial en el nombre del resultado
            for (java.util.Map<String, Object> r : resultados) {
                @SuppressWarnings("unchecked")
                java.util.Map<String, Object> address = (java.util.Map<String, Object>) r.get("address");
                if (address == null) continue;
                
                String countryCode = (String) address.get("country_code");
                if (!"es".equals(countryCode)) continue;
                
                String displayName = (String) r.get("display_name");
                String name = (String) r.get("name");
                
                if (name != null) {
                    String nombreNormalizado = java.text.Normalizer
                        .normalize(name.toLowerCase().trim(), java.text.Normalizer.Form.NFD)
                        .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
                    
                    if (nombreNormalizado.equals(ciudadNormalizada)) {
                        // Buscar el nombre de ciudad correcto en address
                        String ciudadCorrecta = name;
                        if (address.get("city") != null) ciudadCorrecta = (String) address.get("city");
                        else if (address.get("town") != null) ciudadCorrecta = (String) address.get("town");
                        else if (address.get("municipality") != null) ciudadCorrecta = (String) address.get("municipality");
                        
                        return ResponseEntity.ok(java.util.Map.of("existe", true, "nombre", ciudadCorrecta));
                    }
                }
            }
            
            return ResponseEntity.ok(java.util.Map.of("existe", false, "nombre", ""));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("existe", false, "nombre", ""));
        }
    }
}
