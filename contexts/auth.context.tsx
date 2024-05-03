'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { loginUser, validateSession } from '@/networking/user';
import { ILogin, IUser } from '@/interfaces/user.interface';

interface AuthContextType {
    isValid: boolean;
    user: IUser | null;
    login: (user : ILogin) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isValid, setIsValid] = useState(false);
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const valid = await validateSession();
                setIsValid(valid);

                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem('token');
                if (storedUser && token) {
                    const formattedUser: IUser = JSON.parse(storedUser);
                    setUser(formattedUser);
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/');
            }
        };

        validateToken();
    }, []);

    const login = async (user : ILogin) => {
        try {
            const response = await loginUser(user);
            setIsValid(true);
            setUser(response.data);
            localStorage.setItem('token', response.token as string);
            localStorage.setItem('user', JSON.stringify(response.data));
            router.push('/application');
        } catch (error: any) {
            // Propagate the error message up to the login page
            throw new Error(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isValid, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
