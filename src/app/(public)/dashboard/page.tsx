// src/app/(public)/dashboard/page.tsx

import { getAllTasksForDashboard } from "@/lib/data-access";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { RecentTasksList } from "@/components/dashboard/RecentTasksList";
import { PrintButton } from "@/components/dashboard/PrintButton";

export default async function DashboardPage() {
    const allTasks = await getAllTasksForDashboard() || [];

    const statusCounts = allTasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const tasksByStatus = [
        { name: 'Pendiente', value: statusCounts['Pendiente'] || 0 },
        { name: 'En Progreso', value: statusCounts['En Progreso'] || 0 },
        { name: 'Completada', value: statusCounts['Completada'] || 0 },
    ];
    
    const divisionCounts = allTasks.reduce((acc, task) => {
        const divisionName = task.expand?.division?.name || 'Sin División Asignada';
        acc[divisionName] = (acc[divisionName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const tasksByDivision = Object.entries(divisionCounts).map(([name, value]) => ({ name, value }));
    
    const totalProgress = allTasks.reduce((sum, task) => sum + task.progress_percent, 0);
    const averageProgress = allTasks.length > 0 ? totalProgress / allTasks.length : 0;
    
    const recentTasks = allTasks.slice(0, 5);

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="text-center py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-left">
                        <h1 className="text-3xl font-bold text-gray-800">Vista General de Proyectos</h1>
                        <p className="mt-2 text-lg text-gray-600">Estado agregado de todas las tareas y proyectos en el sistema.</p>
                    </div>
                    <div className="noprint">
                        {/* Asumo que ya tienes este componente creado */}
                        {/* <PrintButton /> */}
                    </div>
                </div>
            </div>
            
            {allTasks.length > 0 ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <DashboardCharts 
                        tasksByStatus={tasksByStatus}
                        tasksByDivision={tasksByDivision}
                        averageProgress={averageProgress}
                    />
                    <div className="mt-8 print-break-before">
                         {/* Asumo que ya tienes este componente creado */}
                        <RecentTasksList tasks={recentTasks} />
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-500">No hay datos de tareas disponibles para mostrar en el dashboard.</p>
                </div>
            )}
        </main>
    );
}