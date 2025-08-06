// src/components/auth/login-form.tsx

'use client';

import { useState, useTransition } from 'react';
import { loginAction } from '@/app/login/actions'; // Importamos el Server Action

const inputStyle = {
    display: 'block', width: '300px', padding: '10px', margin: '10px 0',
    borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px',
};
const buttonStyle = {
    width: '100%', padding: '12px', backgroundColor: '#0070f3', color: 'white',
    border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold',
};
const errorStyle = {
    color: 'red', textAlign: 'center' as const, minHeight: '24px',
};

export function LoginForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await loginAction(formData);
            if (result && !result.success) {
                setError(result.message);
            }
        });
    };

    return (
        // El `action` del formulario ahora apunta directamente a nuestra función
        <form action={handleSubmit}>
            <div style={errorStyle}>{error}</div>
            
            <div>
                <label htmlFor="email">Email</label>
                <input
                    id="email" name="email" type="email" // Añadimos el atributo `name`
                    style={inputStyle} required disabled={isPending} placeholder="ejemplo@correo.com"
                />
            </div>
            <div>
                <label htmlFor="password">Contraseña</label>
                <input
                    id="password" name="password" type="password" // Añadimos el atributo `name`
                    style={inputStyle} required disabled={isPending} placeholder="••••••••"
                />
            </div>
            <div style={{width: '320px', paddingTop: '10px'}}>
                <button type="submit" style={buttonStyle} disabled={isPending}>
                    {isPending ? 'Iniciando...' : 'Iniciar Sesión'}
                </button>
            </div>
        </form>
    );
}