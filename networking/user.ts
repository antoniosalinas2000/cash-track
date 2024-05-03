import { ILogin, IUser } from "@/interfaces/user.interface";

export const createUser = async (user: IUser) => {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return response.json();
    } catch (error) {
        console.error(error);
    }
};


export const loginUser = async (login: ILogin) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        });
    
        return response.json();
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const validateSession = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/validate/session`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
    });

    if (response.ok) {
        return response.json();
    }

    throw new Error('Session validation failed');
};
