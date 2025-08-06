// src/components/layout/Footer.tsx

const APP_VERSION = "1.0.0-beta";

export function Footer() {
    return (
        <footer className="w-full bg-slate-100 border-t border-slate-200">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
                <p>
                    Creado y Desarrollado por Ing. LionellNava21, para uso exclusivo, experimental de la Secretaria de Educación Superior, adscrita a la Gobernación Bolivariana del estado Zulia. Bajo convenio Mutuo.
                </p>
                <p className="mt-1">
                    Se reservan todos los derechos. © 2025 | Versión: {APP_VERSION}
                </p>
            </div>
        </footer>
    );
}