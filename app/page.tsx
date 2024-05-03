'use client';

import { useAuth } from "@/contexts/auth.context";
import { ILogin } from "@/interfaces/user.interface";
import { loginUser } from "@/networking/user";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const {user, login} = useAuth();

  const [formState, setFormState] = useState<ILogin>({ email: '', password: '' });
  const [loading, setLoading] = useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await login(formState);
    
    setLoading(false);
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-cash-green to-cash-blue">
      <div className="flex flex-col items-center justify-center py-16 px-32 bg-white rounded-md gap-12">
        <form onSubmit={onSubmit} className="flex flex-col  gap-4 w-full h-full items-start justify-center">
          <div className="flex flex-col w-full">
            <label className="text-lg font-semibold">Correo Electrónico</label>
            <input type="text" onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-lg font-semibold">Contraseña</label>
            <input type="password" onChange={(e) => setFormState({ ...formState, password: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
          </div>

          <button className="bg-cash-blue text-white rounded-md p-2 w-full flex items-center justify-center">
            {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : "Iniciar Sesión"}
          </button>
        </form>
        <Link href="/register">No tienes cuenta? <span className="font-bold">Regístrate</span></Link>
      </div>
    </main>
  );
}
