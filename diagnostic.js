// diagnostic.js
import PocketBase from 'pocketbase';

// --- CONFIGURACIÓN ---
// Asegúrate de que esta URL sea la correcta.
const POCKETBASE_URL = 'http://127.0.0.1:8090';

// ¡¡¡IMPORTANTE!!! Usa las credenciales exactas de un usuario existente.
const TEST_EMAIL = 'jefe.operaciones@test.com'; // Reemplaza si es necesario
const TEST_PASSWORD = '12345678';        // ¡REEMPLAZA ESTO!

// --- SCRIPT DE PRUEBA ---
async function runDiagnostic() {
    console.log('--- INICIANDO SCRIPT DE DIAGNÓSTICO DE POCKETBASE ---');
    
    // 1. Crear una instancia del cliente
    console.log(`[Paso 1] Creando cliente para: ${POCKETBASE_URL}`);
    const pb = new PocketBase(POCKETBASE_URL);

    // 2. Intentar autenticar
    console.log(`[Paso 2] Intentando autenticar al usuario: ${TEST_EMAIL}`);
    try {
        const authData = await pb.collection('users').authWithPassword(TEST_EMAIL, TEST_PASSWORD);
        
        console.log('\n✅ ¡ÉXITO! La autenticación se completó sin errores.');
        
        // 3. Verificar el estado del AuthStore después de la llamada
        console.log('[Paso 3] Verificando el estado de pb.authStore...');
        
        if (pb.authStore.isValid) {
            console.log('  - pb.authStore.isValid: true');
            console.log(`  - Token: ${pb.authStore.token.substring(0, 15)}...`);
            console.log('  - Modelo de usuario (ID):', pb.authStore.model.id);
            console.log('  - Modelo de usuario (Email):', pb.authStore.model.email);
            
            console.log('\n✅ CONCLUSIÓN: El SDK de PocketBase funciona correctamente con estas credenciales.');

        } else {
            console.error('\n❌ FALLO CRÍTICO: La autenticación no lanzó error, pero authStore NO es válido.');
            console.error('  - pb.authStore.isValid:', pb.authStore.isValid);
            console.error('  - pb.authStore.token:', pb.authStore.token);
            console.error('  - Modelo de usuario:', pb.authStore.model);
            console.error('\n❌ CONCLUSIÓN: Hay un problema muy extraño con el SDK o la respuesta del servidor.');
        }

    } catch (error) {
        console.error('\n❌ ¡FALLO! La autenticación lanzó un error.');
        console.error('[Paso 3] Detalles del error capturado:');
        
        if (error.isAbort) {
            console.error('  - Tipo de error: Petición abortada (AbortError).');
            console.error('  - Posible causa: Problema de red, timeout, o el servidor no responde.');
        } else {
            console.error('  - Status del error:', error.status);
            console.error('  - Mensaje del error:', error.message);
            console.error('  - Datos del error:', error.data);
        }
        
        console.error('\n❌ CONCLUSIÓN: Las credenciales son incorrectas o hay un problema de conexión/configuración del servidor.');
    }

    console.log('\n--- SCRIPT DE DIAGNÓSTICO FINALIZADO ---');
}

// Ejecutar el script
runDiagnostic();