// src/app/login/actions.ts

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
// --- CORRECCIÓN CRÍTICA ---
// Importamos la función desde el archivo correcto.
import { createServerClient } from '@/lib/pocketbase'; 

export async function loginAction(formData: FormData) {
    const pb = createServerClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: "Email y contraseña son requeridos." };
    }

    try {
        await pb.collection('users').authWithPassword(email, password);

        if (!pb.authStore.isValid) {
            throw new Error("Credenciales inválidas.");
        }
        
        const authCookie = pb.authStore.exportToCookie({ httpOnly: false });
        const cookieStore = await cookies();
        cookieStore.set('pb_auth', authCookie, { httpOnly: false });
        
    } catch (error: any) {
        console.error('Error en loginAction:', error);
        return { success: false, message: "Las credenciales son incorrectas." };
    }

    redirect('/tasks');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('pb_auth');
    redirect('/login');
}