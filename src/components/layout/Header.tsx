// src/components/layout/Header.tsx

import Link from 'next/link';
import { cookies } from 'next/headers';
// --- CORRECCIÓN CRÍTICA ---
import { createServerClient } from '@/lib/pocketbase'; 
import { logoutAction } from '@/app/login/actions';
import type { User } from '@/lib/types';

export async function Header() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('pb_auth')?.value;

    let currentUser: User | null = null;
    let isLoggedIn = false;

    if (authCookie) {
        const pb = createServerClient();
        pb.authStore.loadFromCookie(authCookie);
        try {
            if (pb.authStore.isValid) {
                await pb.collection('users').authRefresh();
                currentUser = pb.authStore.model as User;
                isLoggedIn = true;
            }
        } catch (_) {
            isLoggedIn = false;
        }
    }

    return (
        <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 2rem', borderBottom: '1px solid #eaeaea', backgroundColor: 'white'
        }}>
            <Link href={isLoggedIn ? "/tasks" : "/"} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold', fontSize: '1.2rem' }}>
                Momentum App
            </Link>
            <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link href="/dashboard" style={{ textDecoration: 'none', color: '#555' }}>
                    Dashboard
                </Link>
                {isLoggedIn && currentUser ? (
                    <>
                        <Link href="/tasks" style={{ textDecoration: 'none', color: '#555' }}>
                            Mis Tareas
                        </Link>
                        <span style={{ color: '#888' }}>|</span>
                        <span style={{ fontStyle: 'italic' }}>{currentUser.email}</span>
                        <form action={logoutAction}>
                            <button type="submit" style={{ background: 'none', border: '1px solid #ccc', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', color: '#333' }}>
                                Cerrar Sesión
                            </button>
                        </form>
                    </>
                ) : (
                    <Link href="/login" style={{
                        padding: '8px 16px', backgroundColor: '#0070f3',
                        color: 'white', textDecoration: 'none', borderRadius: '5px'
                    }}>
                        Iniciar Sesión
                    </Link>
                )}
            </nav>
        </header>
    );
}