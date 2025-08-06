// scripts/seed.mjs

import PocketBase from 'pocketbase';
import dotenv from 'dotenv'; // 1. Importa dotenv explícitamente
import path from 'path';     // 2. Importa el módulo 'path' de Node.js

// 3. Carga explícitamente las variables desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// --- CONFIGURACIÓN (No cambia) ---
const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL;
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD;

if (!POCKETBASE_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('Asegúrate de que POCKETBASE_URL, PB_ADMIN_EMAIL, y PB_ADMIN_PASSWORD están en tu .env.local');
}

// ... (El resto del script, desde la línea `const DIVISIONS_DATA = [...]` hacia abajo, se queda exactamente igual)
// ...

// --- DATOS DE PRUEBA ---
const DIVISIONS_DATA = [
  { name: 'Operaciones' },
  { name: 'Marketing' },
];

const USERS_DATA = [
  {
    email: 'jefe.operaciones@test.com',
    password: '12345678',
    name: 'Ana Jefa',
    position: 'Directora de Operaciones',
    role: 'supermanager',
    divisionName: 'Operaciones',
  },
  {
    email: 'empleado.operaciones@test.com',
    password: '12345678',
    name: 'Carlos Currela',
    position: 'Analista de Datos',
    role: 'employee',
    divisionName: 'Operaciones',
  },
];

const TASKS_DATA = [
  {
    titulo: 'Lanzar campaña publicitaria',
    assigneeEmail: 'jefe.operaciones@test.com',
    divisionName: 'Operaciones',
    status: 'Pendiente',
    progress_percent: 0,
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 días desde ahora
  },
  {
    titulo: 'Preparar reporte trimestral',
    assigneeEmail: 'empleado.operaciones@test.com',
    divisionName: 'Operaciones',
    status: 'En Progreso',
    progress_percent: 50,
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días desde ahora
  },
];

// --- SCRIPT PRINCIPAL ---

async function seed() {
  console.log('--- Iniciando script de seeding ---');
  const pb = new PocketBase(POCKETBASE_URL);

  console.log('Autenticando como admin...');
  await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log('✅ Autenticación de admin exitosa.');

  console.log('\nLimpiando colecciones existentes...');
  const collectionsToClear = ['tasks', 'proposals', 'users', 'divisions'];
  for (const collectionName of collectionsToClear) {
    try {
      const records = await pb.collection(collectionName).getFullList();
      for (const record of records) {
        await pb.collection(collectionName).delete(record.id);
      }
      console.log(`- Colección "${collectionName}" limpiada.`);
    } catch (e) {
      console.log(`- Colección "${collectionName}" no encontrada o ya vacía, se omite la limpieza.`);
    }
  }
  console.log('✅ Colecciones limpiadas.');

  console.log('\nCreando divisiones...');
  const createdDivisions = {};
  for (const division of DIVISIONS_DATA) {
    const newDivision = await pb.collection('divisions').create(division);
    createdDivisions[newDivision.name] = newDivision.id;
    console.log(`- Creada división: ${newDivision.name}`);
  }
  console.log('✅ Divisiones creadas.');

  console.log('\nCreando usuarios...');
  const createdUsers = {};
  for (const user of USERS_DATA) {
    const newUser = await pb.collection('users').create({
      ...user,
      division: createdDivisions[user.divisionName],
      passwordConfirm: user.password,
    });
    createdUsers[newUser.email] = newUser.id;
    console.log(`- Creado usuario: ${newUser.name}`);
  }
  console.log('✅ Usuarios creados.');
  
  console.log('\nAsignando managers...');
  const anaJefaId = createdUsers['jefe.operaciones@test.com'];
  const operacionesId = createdDivisions['Operaciones'];
  await pb.collection('divisions').update(operacionesId, { manager: anaJefaId });
  console.log(`- "Ana Jefa" asignada como manager de "Operaciones".`);
  console.log('✅ Managers asignados.');
  
  console.log('\nCreando tareas...');
  for (const task of TASKS_DATA) {
    await pb.collection('tasks').create({
      ...task,
      assignee: createdUsers[task.assigneeEmail],
      division: createdDivisions[task.divisionName],
    });
    console.log(`- Creada tarea: "${task.titulo}"`);
  }
  console.log('✅ Tareas creadas.');

  console.log('\n--- Script de seeding completado exitosamente. ---');
}

seed().catch((e) => {
  console.error('❌ Error durante el seeding:', e.originalError || e);
  process.exit(1);
});