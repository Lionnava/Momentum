// src/lib/pocketbase.ts

import PocketBase from 'pocketbase';

const pocketbaseUrl = process.env.NEXT_PUBLIC_POCKETBASE_URL;

if (!pocketbaseUrl) {
    throw new Error("FATAL: La variable de entorno NEXT_PUBLIC_POCKETBASE_URL no está definida.");
}

// Cliente Singleton para usar en Componentes de Cliente ('use client')
export const pb = new PocketBase(pocketbaseUrl);

/**
 * Crea una nueva instancia de PocketBase para ser usada en el lado del servidor.
 * Esto evita que las cookies de diferentes usuarios se mezclen.
 */
export function createServerClient() {
    return new PocketBase(pocketbaseUrl);
}

// Usamos `export default` para la instancia principal por convención
export default pb;