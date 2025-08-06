// src/app/(private)/tasks/new/page.tsx

import { getUsers, getDivisions, getAllTaskTitles } from "@/lib/data-access";
import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import Link from 'next/link';

// La función exportada por defecto DEBE ser un componente async que devuelve JSX
export default async function NewTaskPage() {
    // Obtenemos todos los datos necesarios para el formulario en paralelo
    const [users, divisions, allTasks] = await Promise.all([
        getUsers(),
        getDivisions(),
        getAllTaskTitles()
    ]);

    // Ahora, retornamos el JSX que compone la página
    return (
        <main className="max-w-2xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Crear Nueva Tarea</h1>
                <Link href="/tasks" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                    Cancelar
                </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {/* Pasamos los datos obtenidos al componente del formulario */}
                <CreateTaskForm users={users} divisions={divisions} allTasks={allTasks} />
            </div>
        </main>
    );
}