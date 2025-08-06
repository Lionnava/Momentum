// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Obtener la cookie de autenticación
    const authCookie = request.cookies.get('pb_auth');

    // La forma más segura de saber si está logueado es verificar si la cookie existe y tiene valor.
    const isLoggedIn = !!authCookie?.value;

    const isAccessingPrivateRoute = pathname.startsWith('/tasks') || pathname.startsWith('/profile');
    const isAccessingAuthRoute = pathname.startsWith('/login');

    // 1. Si intenta acceder a una ruta privada y NO está logueado
    if (isAccessingPrivateRoute && !isLoggedIn) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. Si ya está logueado e intenta acceder a la página de login
    if (isAccessingAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL('/tasks', request.url));
    }

    // 3. En cualquier otro caso, permitir que la petición continúe
    return NextResponse.next();
}

// Configuración del matcher para que solo se ejecute en las rutas relevantes
export const config = {
    matcher: [
        '/tasks/:path*',
        '/profile/:path*',
        '/login',
    ],
};