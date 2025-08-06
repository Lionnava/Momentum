// src/lib/auth.ts

import { cookies } from 'next/headers';

export async function isLoggedIn() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('pb_auth');
    // La forma más simple: si la cookie existe y tiene valor, asumimos que está logueado.
    // PocketBase validará el token en las peticiones de datos.
    return !!authCookie?.value;
}