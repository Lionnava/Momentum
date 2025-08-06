// src/app/forgot-password/page.tsx

'use client';

import { useState, useTransition } from 'react';
import { requestPasswordResetAction } from '../account-actions';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await requestPasswordResetAction(formData);
            if (result) {
                setMessage(result.message);
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Restablecer Contraseña</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>
                
                {message ? (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                        {message}
                    </div>
                ) : (
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email" name="email" type="email" autoComplete="email" required disabled={isPending}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="tu-correo@registrado.com"
                            />
                        </div>
                        <div>
                            <button type="submit" disabled={isPending}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                                {isPending ? 'Enviando...' : 'Enviar Enlace de Reseteo'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-sm text-center">
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Volver a Iniciar Sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}