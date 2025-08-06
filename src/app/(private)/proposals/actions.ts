// src/app/(private)/proposals/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAuthedClient } from '@/lib/pocketbase';
import type { Division, User, Proposal } from '@/lib/types';

export async function createProposalAction(formData: FormData) {
    const pb = await createAuthedClient();
    const currentUser = pb.authStore.model as User | null;
    if (!currentUser) return;

    const data = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        division: formData.get('division') as string,
        proposer: currentUser.id,
        // --- LÓGICA DE ESTADO INICIAL INTELIGENTE ---
        // Si un manager crea una propuesta, salta un paso y va directo al supermanager.
        status: (currentUser.rol === 'manager' || currentUser.rol === 'supermanager') ? 'Pendiente superManager' : 'Pendiente Manager',
    };

    try {
        await pb.collection('proposals').create(data);
    } catch (error) {
        console.error("Error creando propuesta:", error);
    }

    revalidatePath('/proposals');
    redirect('/tasks');
}

export async function updateProposalAction(formData: FormData) {
    const pb = await createAuthedClient();
    const currentUser = pb.authStore.model as User | null;
    if (!currentUser) return;
    
    const proposalId = formData.get('proposalId') as string;
    const action = formData.get('action') as 'pre-approve' | 'approve' | 'reject';
    const decision_notes = formData.get('decision_notes') as string;

    if (!proposalId || !action) return;
    
    const proposal = await pb.collection('proposals').getOne<Proposal>(proposalId);
    let newStatus: Proposal['status'] | null = null;
    let createNewTask = false;

    // --- MÁQUINA DE ESTADOS ACTUALIZADA ---
    if (action === 'pre-approve' && currentUser.rol === 'manager' && proposal.status === 'Pendiente Manager') {
        newStatus = 'Pendiente superManager';
    } else if (action === 'approve' && currentUser.rol === 'supermanager' && proposal.status === 'Pendiente superManager') {
        newStatus = 'Aprobada';
        createNewTask = true;
    } else if (action === 'reject' && (currentUser.rol === 'manager' || currentUser.rol === 'supermanager')) {
        newStatus = 'Rechazada';
    } else {
        return;
    }

    try {
        await pb.collection('proposals').update(proposalId, { status: newStatus, decision_notes });

        if (createNewTask) {
            const division = await pb.collection('divisions').getOne<Division>(proposal.division);
            const managerOfDivision = await pb.collection('users').getOne(division.manager);

            await pb.collection('tasks').create({
                titulo: proposal.title,
                notes: proposal.description,
                assignee: managerOfDivision.id, 
                division: proposal.division,
                status: 'Pendiente',
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                progress_percent: 0,
            });
        }
    } catch (error) {
        console.error(`Error procesando acción:`, error);
    }

    revalidatePath('/proposals');
    revalidatePath('/tasks');
}