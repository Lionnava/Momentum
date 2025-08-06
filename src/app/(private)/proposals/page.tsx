// src/app/(private)/proposals/page.tsx

import { getProposalsForCurrentUser, getCurrentUser } from '@/lib/data-access';
import type { Proposal, User } from '@/lib/types';
import { updateProposalAction } from './actions';
import Link from 'next/link';
import { MarkdownRenderer } from '@/components/ui/MarkdownRenderer';

function ProposalCard({ proposal, currentUser }: { proposal: Proposal, currentUser: User | null }) {
    const canPreApprove = currentUser?.rol === 'manager' && proposal.status === 'Pendiente Manager';
    const canApprove = currentUser?.rol === 'supermanager' && proposal.status === 'Pendiente Director';
    const canReject = canPreApprove || canApprove;
    
    const updateAction = updateProposalAction.bind(null);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 my-4 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">{proposal.title}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-4 text-sm">
                <p><strong>Propuesto por:</strong> {proposal.expand?.proposer?.name || 'Desconocido'}</p>
                <p><strong>División:</strong> {proposal.expand?.division?.name || 'N/A'}</p>
            </div>
            
            <div className="mt-2 text-gray-700 prose prose-sm max-w-none">
                <MarkdownRenderer content={proposal.description} />
            </div>

            <form action={updateAction} className="space-y-4 mt-4">
                <input type="hidden" name="proposalId" value={proposal.id} />
                <div>
                    <label htmlFor={`notes-${proposal.id}`} className="block text-sm font-medium text-gray-700">Notas / Justificación</label>
                    <textarea
                        id={`notes-${proposal.id}`} name="decision_notes" rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Añade comentarios..."
                    ></textarea>
                </div>
                <div className="flex gap-4">
                    {canPreApprove && <button type="submit" name="action" value="pre-approve" className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600">Pre-Aprobar</button>}
                    {canApprove && <button type="submit" name="action" value="approve" className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600">Aprobar</button>}
                    {canReject && <button type="submit" name="action" value="reject" className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600">Rechazar</button>}
                </div>
            </form>
        </div>
    );
}

export default async function ProposalsPage() {
    const [proposals, currentUser] = await Promise.all([
        getProposalsForCurrentUser(),
        getCurrentUser()
    ]);

    return (
        <main className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Propuestas Pendientes de Revisión</h1>
                <Link href="/tasks" className="text-sm font-medium text-gray-600 hover:text-blue-600">Volver a Tareas</Link>
            </div>
            {proposals.length > 0 ? (
                proposals.map(p => <ProposalCard key={p.id} proposal={p} currentUser={currentUser} />)
            ) : (
                <p className="mt-8 text-center text-gray-500 italic">No hay propuestas pendientes de revisión.</p>
            )}
        </main>
    );
}