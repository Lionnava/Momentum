// src/app/(private)/tasks/[id]/page.tsx

import { getTaskById, getAdvancesForTask } from "@/lib/data-access";
import type { Advance } from "@/lib/types";
import Link from 'next/link';
import { FaChevronLeft, FaCheckCircle, FaCircle } from 'react-icons/fa';

function AdvanceItem({ advance }: { advance: Advance }) {
    // ... (este componente no cambia)
    return (
        <li className="flex items-center gap-3 p-3 border-b border-gray-200">
            {advance.is_completed ? <FaCheckCircle className="text-green-500" /> : <FaCircle className="text-gray-300 text-xs" />}
            <span className={advance.is_completed ? 'line-through text-gray-500' : 'text-gray-800'}>{advance.description}</span>
        </li>
    );
}


export default async function TaskDetailPage({ params }: { params: { id: string } }) {
    // --- CORRECCIÓN CRÍTICA AQUÍ ---
    // En Next.js 15, debemos esperar a `params` para acceder a sus propiedades.
    const awaitedParams = await params;
    const taskId = awaitedParams.id;

    // Ahora usamos 'taskId' en nuestras llamadas a la base de datos
    const [task, advances] = await Promise.all([
        getTaskById(taskId),
        getAdvancesForTask(taskId)
    ]);

    if (!task) {
        return (
            <main className="max-w-4xl mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600">Tarea no encontrada</h1>
                <p className="text-gray-500 mt-2">La tarea que buscas no existe o no tienes permiso para verla.</p>
                <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:underline">
                    ← Volver a la lista de tareas
                </Link>
            </main>
        );
    }

    const dueDate = new Date(task.due_date).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

    return (
        <main className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link href="/tasks" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                    <FaChevronLeft />
                    Volver a Todas las Tareas
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">{task.titulo}</h1>
                <p className="mt-2 text-gray-600">{task.notes || 'No hay notas adicionales para esta tarea.'}</p>
                
                <div className="grid grid-cols-2 gap-4 my-6 text-sm">
                    <div>
                        <p className="text-gray-500">Asignado a</p>
                        <p className="font-semibold text-gray-800">{task.expand?.assignee?.name}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">División</p>
                        <p className="font-semibold text-gray-800">{task.expand?.division?.name}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">Estado</p>
                        <p className="font-semibold text-gray-800">{task.status}</p>
                    </div>
                     <div>
                        <p className="text-gray-500">Fecha Límite</p>
                        <p className="font-semibold text-gray-800">{dueDate}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-600">Progreso: {task.progress_percent}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                        <div className="bg-green-500 h-4 rounded-full text-white flex items-center justify-center text-xs" style={{ width: `${task.progress_percent}%` }}>
                           {task.progress_percent > 10 && `${task.progress_percent}%`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Checklist de Avances</h2>
                {advances.length > 0 ? (
                    <ul>
                        {advances.map(adv => <AdvanceItem key={adv.id} advance={adv} />)}
                    </ul>
                ) : (
                    <p className="text-gray-500 italic">No se han definido avances para esta tarea.</p>
                )}
            </div>
        </main>
    );
}