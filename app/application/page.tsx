'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICategory, IDashboardData, IExpense, IIncome } from '@/interfaces/dashboard.interface';
import DoughnutChart from './components/donut';
import { TransactionModal } from './components/transaction.modal';
import { getDashboardData, addTransaction, deleteTransaction, updateTransaction } from '@/networking/dashboard';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<IDashboardData>();
    const [dashboardDataFiltered, setDashboardDataFiltered] = useState<IDashboardData>();

    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [expensesCategories, setExpensesCategories] = useState<ICategory[]>([]);
    const [incomesCategories, setIncomesCategories] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const [selectedTransaction, setSelectedTransaction] = useState<IIncome | IExpense | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = parseInt(event.target.value);
        setSelectedMonth(newMonth);
    };

    useEffect(() => {
        if (dashboardData) {
            filterDataByMonth(selectedMonth);
        }
    }, [selectedMonth, dashboardData]); // This useEffect will re-filter data whenever the month or the data changes



    const fetchDashboardData = async () => {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data.data);
        setDashboardDataFiltered(data.data);
        setExpensesCategories(data.data.expense_categories);
        setIncomesCategories(data.data.income_categories);
        setLoading(false);
    };

    const filterDataByMonth = (month: number) => {
        const filteredExpenses = dashboardData?.expense_data.filter(expense => {
            const date = new Date(expense.date);
            const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            return utcDate.getMonth() === month;
        });
        const filteredIncomes = dashboardData?.income_data.filter(income => {
            const date = new Date(income.date);
            const utcDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            return utcDate.getMonth() === month;
        });

        setDashboardDataFiltered({
            expense_categories: dashboardData?.expense_categories || [],
            income_categories: dashboardData?.income_categories || [],
            expense_data: filteredExpenses || [],
            income_data: filteredIncomes || [],
        });
    };


    const handleAddExpense = async (transaction: IExpense) => {
        let newTransaction: IExpense;

        try {
            const response = await addTransaction(transaction, 'expense');
            newTransaction = {
                ...transaction,
                expense_id: response.data.transaction_id,
            }

            const newTransactions = dashboardData?.expense_data.concat(newTransaction);
            if (!newTransactions) return;
            if (!dashboardData) return;

            setDashboardData({
                ...dashboardData,
                expense_data: newTransactions,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddIncome = async (transaction: IIncome) => {
        let newTransaction: IIncome;

        try {
            const response = await addTransaction(transaction, 'income');
            newTransaction = {
                ...transaction,
                income_id: response.data.transaction_id,
            }

            const newTransactions = dashboardData?.income_data.concat(newTransaction);
            if (!newTransactions) return;
            if (!dashboardData) return;

            setDashboardData({
                ...dashboardData,
                income_data: newTransactions,
            })
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteTransaction = async (transactionId: string, type: 'income' | 'expense') => {
        const response = await deleteTransaction(transactionId, type);

        if (response.status === 200) {
            const updatedTransactions = type === 'income'
                ? dashboardData?.income_data.filter((transaction) => transaction.income_id !== transactionId)
                : dashboardData?.expense_data.filter((transaction) => transaction.expense_id !== transactionId);

            if (!updatedTransactions || !dashboardData) return;

            type === 'income' ?
                setDashboardData({
                    income_data: updatedTransactions as IIncome[],
                    expense_categories: dashboardData.expense_categories,
                    income_categories: dashboardData.income_categories,
                    expense_data: dashboardData.expense_data,
                }) :
                setDashboardData({
                    expense_data: updatedTransactions as IExpense[],
                    expense_categories: dashboardData.expense_categories,
                    income_categories: dashboardData.income_categories,
                    income_data: dashboardData.income_data,
                });
        }
    };

    const handleEditTransaction = async (transaction: IIncome | IExpense, type: 'income' | 'expense') => {
        //open modal according to type
        setSelectedTransaction(transaction);
        type === 'income' ? setShowIncomeModal(true) : setShowExpenseModal(true);
    };

    const handleEditTransactionSubmit = async (transaction: IIncome | IExpense, type: 'income' | 'expense') => {
        const response = await updateTransaction(transaction, type);

        if (response.status === 200) {
            console.log(transaction);

            const updatedTransactions = type === 'income'
                ? dashboardData?.income_data.map((t) => t.income_id === (transaction as IIncome).income_id ? transaction : t)
                : dashboardData?.expense_data.map((t) => t.expense_id === (transaction as IExpense).expense_id ? transaction : t);

            console.log('edit', updatedTransactions);
            if (!updatedTransactions || !dashboardData) return;

            type === 'income' ?
                setDashboardData({
                    income_data: updatedTransactions as IIncome[],
                    expense_categories: dashboardData.expense_categories,
                    income_categories: dashboardData.income_categories,
                    expense_data: dashboardData.expense_data,
                }) :
                setDashboardData({
                    expense_data: updatedTransactions as IExpense[],
                    expense_categories: dashboardData.expense_categories,
                    income_categories: dashboardData.income_categories,
                    income_data: dashboardData.income_data,
                });
        }

        setSelectedTransaction(null);
    }


    return (
        <main className="min-h-screen p-8 flex flex-col mx-auto gap-8 bg-cash-black">
            <div className="flex justify-between items-center py-4 border-b">
                <div className="flex flex-row gap-4 items-center">
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <select className="p-2 border rounded" value={selectedMonth} onChange={handleMonthChange}>
                        {months.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-row gap-4 items-center'>
                    <button onClick={() => setShowExpenseModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Añadir Gasto
                    </button>
                    <button onClick={() => setShowIncomeModal(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Añadir Ingreso
                    </button>
                </div>
            </div>

            <div className="flex flex-row w-full justify-between gap-6">

                <div className='flex flex-col gap-8 w-full items-center justify-start bg-white shadow shadow-black p-4 rounded-3xl'>
                    <h3 className="font-semibold text-2xl">Gastos</h3>
                    {dashboardDataFiltered?.expense_data.length ? (
                        <DoughnutChart data={dashboardDataFiltered.expense_data} categories={expensesCategories} />
                    ) : (
                        <p className="text-gray-500">No hay data.</p>
                    )}
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                <th className='font-semibold border border-slate-300'>Nombre</th>
                                <th className='font-semibold border border-slate-300'>Monto</th>
                                <th className='font-semibold border border-slate-300'>Fecha</th>
                                <th className='font-semibold border border-slate-300'>Categoría</th>
                                <th className='font-semibold border border-slate-300'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardDataFiltered?.expense_data.map((expense, index) => (
                                <tr key={index}>
                                    <td className='border border-slate-300 px-2'>{expense.name}</td>
                                    <td className='border border-slate-300 px-2'>S/.{expense.amount}</td>
                                    <td className='border border-slate-300 px-2'>{expense.date.split('T')[0]}</td>
                                    <td className='border border-slate-300 px-2'>{expensesCategories.find((c) => c.category_id === expense.expense_category_id)?.name}</td>
                                    <td className='border border-slate-300 px-2 gap-4 '>
                                        <div className='flex flex-row gap-4 justify-center w-full'>
                                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleEditTransaction(expense, 'expense')}>Editar</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteTransaction(expense.expense_id!, 'expense')}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/*count the total spent in each category*/}
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                <th className='font-semibold border border-slate-300'>Categoría</th>
                                <th className='font-semibold border border-slate-300'>Total Gastado</th>

                            </tr>
                        </thead>
                        <tbody>
                            {expensesCategories.map((category, index) => {
                                const total = dashboardDataFiltered?.expense_data
                                    .filter((expense) => expense.expense_category_id === category.category_id)
                                    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                                return (
                                    <tr key={index}>
                                        <td className='border border-slate-300 px-2'>{category.name}</td>
                                        <td className='border border-slate-300 px-2'>S/.{total?.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='flex flex-col gap-8 w-full items-center justify-start bg-white shadow shadow-black p-4 rounded-3xl'>
                    <h3 className="font-semibold text-2xl">Ingresos</h3>
                    {dashboardDataFiltered?.income_data.length ? (
                        <DoughnutChart data={dashboardDataFiltered.income_data} categories={incomesCategories} />
                    ) : (
                        <p className="text-gray-500">No hay data.</p>
                    )}
                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                <th className='font-semibold border border-slate-300'>Nombre</th>
                                <th className='font-semibold border border-slate-300'>Monto</th>
                                <th className='font-semibold border border-slate-300'>Fecha</th>
                                <th className='font-semibold border border-slate-300'>Categoría</th>
                                <th className='font-semibold border border-slate-300'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardDataFiltered?.income_data.map((income, index) => (
                                <tr key={index}>
                                    <td className='border border-slate-300 px-2'>{income.name}</td>
                                    <td className='border border-slate-300 px-2'>S/.{income.amount}</td>
                                    <td className='border border-slate-300 px-2'>{income.date.split('T')[0]}</td>
                                    <td className='border border-slate-300 px-2'>{incomesCategories.find((c) => c.category_id === income.income_category_id)?.name}</td>
                                    <td className='border border-slate-300 px-2'>
                                        <div className='flex flex-row gap-4 justify-center w-full'>
                                            <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleEditTransaction(income, 'income')}>Editar</button>
                                            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteTransaction(income.income_id!, 'income')}>Eliminar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <table className='w-full border-collapse'>
                        <thead>
                            <tr>
                                <th className='font-semibold border border-slate-300'>Categoría</th>
                                <th className='font-semibold border border-slate-300'>Total Gastado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomesCategories.map((category, index) => {
                                const total = dashboardDataFiltered?.income_data
                                    .filter((expense) => expense.income_category_id === category.category_id)
                                    .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                                return (
                                    <tr key={index}>
                                        <td className='border border-slate-300 px-2'>{category.name}</td>
                                        <td className='border border-slate-300 px-2'>S/.{total}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showExpenseModal && (
                <TransactionModal
                    transaction={selectedTransaction ? selectedTransaction : undefined}
                    onSubmit={selectedTransaction ? handleEditTransactionSubmit : handleAddExpense}
                    type="expense" // This could be dynamic based on user selection
                    closeModal={() => setShowExpenseModal(false)}
                    categories={expensesCategories}
                />
            )}


            {showIncomeModal && (
                <TransactionModal
                    transaction={selectedTransaction ? selectedTransaction : undefined}
                    onSubmit={selectedTransaction ? handleEditTransactionSubmit : handleAddIncome}
                    type="income" // This could be dynamic based on user selection
                    closeModal={() => setShowIncomeModal(false)}
                    categories={incomesCategories}
                />
            )}
        </main>
    );
}
