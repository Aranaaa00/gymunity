package com.gymunity.backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Servicio para gestionar la blacklist de tokens JWT revocados.
 * Implementación en memoria con limpieza automática de tokens expirados.
 */
@Service
public class TokenBlacklistService {

    // Map: token -> fecha de expiración
    private final Map<String, Instant> blacklistedTokens = new ConcurrentHashMap<>();

    /**
     * Revoca un token agregándolo a la blacklist.
     * @param token Token JWT a revocar
     * @param expirationTime Fecha de expiración del token
     */
    public void revokeToken(String token, Instant expirationTime) {
        blacklistedTokens.put(token, expirationTime);
        cleanupExpiredTokens();
    }

    /**
     * Verifica si un token está revocado.
     * @param token Token JWT a verificar
     * @return true si el token está en la blacklist
     */
    public boolean isTokenRevoked(String token) {
        cleanupExpiredTokens();
        return blacklistedTokens.containsKey(token);
    }

    /**
     * Limpia tokens expirados de la blacklist para liberar memoria.
     */
    private void cleanupExpiredTokens() {
        Instant now = Instant.now();
        blacklistedTokens.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }

    /**
     * Obtiene el número de tokens actualmente en la blacklist.
     * @return Cantidad de tokens revocados activos
     */
    public int getBlacklistSize() {
        cleanupExpiredTokens();
        return blacklistedTokens.size();
    }
}
