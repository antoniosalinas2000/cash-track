import { IExpense, IIncome } from "@/interfaces/dashboard.interface";

export const getDashboardData = async () => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        return response.json();
    } catch (error) {
        console.error(error);
    }
};

type TransactionType = 'income' | 'expense'; 

export const addTransaction = async (transaction: IExpense | IIncome, type : TransactionType) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transaction/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(transaction)
        });

        return response.json();
    } catch (error) {
        console.error(error);
    }
}