// src/app/(private)/proposals/new/page.tsx

import { getDivisions } from "@/lib/data-access";
import { ProposalForm } from "@/components/proposals/ProposalForm";
import Link from 'next/link';

export default async function NewProposalPage() {
    // Obtenemos las divisiones
    const divisionsData = await getDivisions();

    // --- CORRECCIÓN DE ROBUSTEZ ---
    // Nos aseguramos de que 'divisions' sea siempre un array, incluso si la llamada a la API falla.
    const divisions = Array.isArray(divisionsData) ? divisionsData : [];

    return (
        <main className="max-w-2xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Proponer Nueva Tarea / Proyecto</h1>
                <Link href="/tasks" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                    Cancelar
                </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {/* Pasamos la variable 'divisions' que ahora está garantizada de ser un array */}
                <ProposalForm divisions={divisions} />
            </div>
        </main>
    );
}