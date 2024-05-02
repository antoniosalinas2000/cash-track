'use client';

import { ILogin } from "@/interfaces/user.interface";
import { useState } from "react";

export default function Login() {
    const [formState, setFormState] = useState<ILogin>({email : '', password : ''});

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log(formState)
    };

    return (
        <main className="h-screen flex flex-row p-16 items-center justify-center w-full">
            <div className="flex flex-col w-full h-full">

            </div>
            <form onSubmit={onSubmit} className="flex flex-col  gap-4 w-full h-full items-start justify-center">
                <div className="flex flex-col">
                    <label className="text-lg font-bold">Correo Electrónico</label>
                    <input type="text" onChange={(e) => setFormState({ ...formState, email: e.target.value }) } className="border-2 border-gray-300 rounded-md p-2" />
                </div>
                <div className="flex flex-col">
                    <label className="text-lg font-bold">Contraseña</label>
                    <input type="password" onChange={(e) => setFormState({ ...formState, password: e.target.value }) } className="border-2 border-gray-300 rounded-md p-2" />
                </div>

                <button className="bg-blue-500 text-white rounded-md p-2">Login</button>
            </form>
        </main>
    )
}