'use client';

import { IUser } from "@/interfaces/user.interface";
import { useState } from "react";

export default function Register() {
    const [formState, setFormState] = useState<IUser>({
        email: '',
        password: '',
        name: '',
        last_name: '',
        phone: '',
        birth_date: ''
    });

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(formState)
    };

    return (
        <main className="h-screen flex flex-row p-16 items-center justify-center w-full">
            <div className="flex flex-col w-full h-full">

            </div>
            <form onSubmit={onSubmit} className="flex flex-col  gap-4 w-full h-full items-start justify-center pr-32">
                <div className="flex flex-row gap-4 items-center w-full">
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-bold">Nombre</label>
                        <input type="text" onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-bold">Apellido</label>
                        <input type="text" onChange={(e) => setFormState({ ...formState, last_name: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                    </div>
                </div>

                <div className="flex flex-row gap-4 items-center w-full">
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-bold">Celular</label>
                        <input type="text" onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label className="text-lg font-bold">Fecha de Nacimiento</label>
                        <input type="date" onChange={(e) => setFormState({ ...formState, birth_date: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-lg font-bold">Correo Electrónico</label>
                    <input type="text" onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                </div>
                <div className="flex flex-col w-full">
                    <label className="text-lg font-bold">Contraseña</label>
                    <input type="password" onChange={(e) => setFormState({ ...formState, password: e.target.value })} className="border-2 border-gray-300 rounded-md p-2 w-full" />
                </div>

                <button className="bg-blue-500 text-white rounded-md p-2">Register</button>
            </form>
        </main>
    )
}