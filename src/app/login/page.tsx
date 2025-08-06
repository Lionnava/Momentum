// src/app/login/page.tsx

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        // Usamos un fondo gris claro para toda la página
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 px-4">
            <div className="w-full max-w-md p-5 space-y-3 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    {/* No necesitamos el logo aquí, ya que está en el Header global */}
                    <h1 className="text-3xl font-bold text-gray-900">
                        Accede a tu cuenta
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        para continuar en Momentum
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}