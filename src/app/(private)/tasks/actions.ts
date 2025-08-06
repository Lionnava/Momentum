// src/app/(private)/tasks/actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAuthedClient } from '@/lib/pocketbase';
import { getCurrentUser } from '@/lib/data-access';

export async function createTaskAction(formData: FormData) {
    const pb = await createAuthedClient();
    const currentUser = await getCurrentUser();

    if (currentUser?.rol !== 'manager' && currentUser?.rol !== 'supermanager') {
        return { success: false, message: 'No tienes permiso para realizar esta acción.' };
    }

    const data = {
        titulo: formData.get('titulo') as string,
        assignee: formData.get('assignee') as string,
        division: formData.get('division') as string,
        status: formData.get('status') as string,
        progress_percent: Number(formData.get('progress_percent') ?? 0),
        estimated_hours: Number(formData.get('estimated_hours') ?? 0),
        due_date: new Date(formData.get('due_date') as string),
        // --- AÑADIMOS EL NUEVO CAMPO ---
        // Si el valor es una cadena vacía, lo convertimos a null para que PocketBase no dé error
        depends_on: (formData.get('depends_on') as string) || null,
    };

    if (!data.titulo || !data.assignee || !data.division || !data.due_date) {
        return { success: false, message: 'Faltan campos requeridos.' };
    }

    try {
        await pb.collection('tasks').create(data);
    } catch (error: any) {
        console.error('Error al crear la tarea:', JSON.stringify(error, null, 2));
        return { success: false, message: 'No se pudo crear la tarea.' };
    }

    revalidatePath('/tasks');
    redirect('/tasks');
}