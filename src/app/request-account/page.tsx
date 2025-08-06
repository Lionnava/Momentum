// src/app/request-account/page.tsx

'use client';

import { useState, useTransition } from 'react';
import { requestAccountAction } from '../account-actions';
import Link from 'next/link';

export default function RequestAccountPage() {
    const [isPending, startTransition] = useTransition();
    const [resultMessage, setResultMessage] = useState<{success: boolean, message: string} | null>(null);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await requestAccountAction(formData);
            if (result) {
                setResultMessage(result);
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Solicitud de Nueva Cuenta</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Rellena tus datos para solicitar acceso al sistema.
                    </p>
                </div>
                
                {resultMessage?.success ? (
                    <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
                        {resultMessage.message}
                    </div>
                ) : (
                    <form action={handleSubmit} className="space-y-4">
                        {resultMessage && !resultMessage.success && (
                             <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                                {resultMessage.message}
                            </div>
                        )}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input id="name" name="name" type="text" required disabled={isPending}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input id="email" name="email" type="email" required disabled={isPending}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Puesto de Trabajo</label>
                            <input id="position" name="position" type="text" required disabled={isPending}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="justification" className="block text-sm font-medium text-gray-700">Justificación (Opcional)</label>
                            <textarea id="justification" name="justification" rows={3} disabled={isPending}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>
                        <div>
                            <button type="submit" disabled={isPending}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                                {isPending ? 'Enviando...' : 'Enviar Solicitud'}
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