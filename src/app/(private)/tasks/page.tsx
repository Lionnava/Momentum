// src/app/(private)/tasks/page.tsx

import { getTasksForCurrentUser } from '@/lib/data-access';
import { logoutAction } from '@/app/login/actions'; // 1. Importar la nueva acción
import type { Task } from '@/lib/types';

function TaskCard({ task }: { task: Task }) {
    // Aseguramos que los valores por defecto se muestren si 'expand' no funciona
    const assigneeName = task.expand?.assignee?.name || 'No asignado';
    const divisionName = task.expand?.division?.name || 'Sin división';
    
    // Formateamos la fecha para que sea más legible
    const dueDate = new Date(task.due_date).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', margin: '16px 0', backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#111' }}>{task.titulo}</h3>
            <p><strong>Asignado a:</strong> {assigneeName}</p>
            <p><strong>División:</strong> {divisionName}</p>
            <p><strong>Estado:</strong> {task.status}</p>
            <p><strong>Progreso:</strong> <progress value={task.progress_percent} max="100" style={{width: '100%'}}></progress> {task.progress_percent}%</p>
            <p><strong>Fecha Límite:</strong> {dueDate}</p>
        </div>
    );
}

export default async function TasksPage() {
    const tasks = await getTasksForCurrentUser();
    
    // LOG DE DEPURACIÓN: Esto aparecerá en la terminal de `npm run dev`
    console.log('Datos de Tareas Recibidos:', JSON.stringify(tasks, null, 2));

    return (
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 style={{color: '#333'}}>Mis Tareas</h1>
                
                {/* 2. Añadimos el formulario de logout */}
                <form action={logoutAction}>
                    <button type="submit" style={{padding: '8px 16px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer'}}>
                        Cerrar Sesión
                    </button>
                </form>
            </header>
            
            {tasks.length > 0 ? (
                <div>
                    {tasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            ) : (
                <p style={{marginTop: '2rem', fontStyle: 'italic', color: '#666'}}>No se encontraron tareas asignadas.</p>
            )}
        </main>
    );
}