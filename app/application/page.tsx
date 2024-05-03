'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICategory, IDashboardData, IExpense, IIncome } from '@/interfaces/dashboard.interface';
import DoughnutChart from './components/donut';
import { TransactionModal } from './components/transaction.modal';
import { getDashboardData, addTransaction } from '@/networking/dashboard';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [expensesCategories, setExpensesCategories] = useState<ICategory[]>([]);
    const [incomesCategories, setIncomesCategories] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        fetchDashboardData();

    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data.data);
        setExpensesCategories(data.data.expense_categories);
        setIncomesCategories(data.data.income_categories);
        console.log(data.data.expense_categories);
        console.log(data.data.income_categories);
        setLoading(false);
    };

    const handleAddExpense = (transaction: IExpense) => {
        setShowExpenseModal(false);
        try {
            addTransaction(transaction, 'expense');
        } catch (error) {
            console.error(error);
        }
        //update data
        fetchDashboardData();
    };

    const handleAddIncome = (transaction: IIncome) => {
        setShowIncomeModal(false);
        try {
            addTransaction(transaction, 'income');
        } catch (error) {
            console.error(error);
        }
        //update data
        fetchDashboardData();
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
                    <div className='flex flex-row gap-4 items-center'>
                        <button onClick={() => setShowExpenseModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Añadir Gasto
                        </button>
                        <button onClick={() => setShowIncomeModal(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Añadir Ingreso
                        </button>
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-semibold text-xl mb-2">Filters</h2>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date!)} className="mb-4 w-full p-2 border rounded" />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date!)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="flex flex-row w-full justify-between gap-6">
                        <div className='flex flex-col gap-8 w-full items-center justify-start bg-white shadow shadow-black p-4 rounded-3xl'>
                            <h3 className="font-semibold text-lg">Gastos</h3>
                            {dashboardData?.expense_data.length ? (
                                <DoughnutChart data={dashboardData.expense_data} categories={expensesCategories} />
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData?.expense_data.map((category) => (
                                        <tr>
                                            <td className='border border-slate-300 px-2'>{category.name}</td>
                                            <td className='border border-slate-300 px-2'>S/.{category.amount}</td>
                                            <td className='border border-slate-300 px-2'>{category.date.split('T')[0]}</td>
                                            <td className='border border-slate-300 px-2'>{expensesCategories.find((c) => c.category_id === category.expense_category_id)?.name}</td>
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
                                    {expensesCategories.map((category) => {
                                        const total = dashboardData?.expense_data
                                            .filter((expense) => expense.expense_category_id === category.category_id)
                                            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                                        return (
                                            <tr>
                                                <td className='border border-slate-300 px-2'>{category.name}</td>
                                                <td className='border border-slate-300 px-2'>S/.{total}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className='flex flex-col gap-8 w-full items-center justify-start bg-white shadow shadow-black p-4 rounded-3xl'>
                            <h3 className="font-semibold text-lg">Ingresos</h3>
                            {dashboardData?.income_data.length ? (
                                <DoughnutChart data={dashboardData.income_data} categories={incomesCategories} />
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {dashboardData?.income_data.map((category) => (
                                        <tr>
                                            <td className='border border-slate-300 px-2'>{category.name}</td>
                                            <td className='border border-slate-300 px-2'>S/.{category.amount}</td>
                                            <td className='border border-slate-300 px-2'>{category.date.split('T')[0]}</td>
                                            <td className='border border-slate-300 px-2'>{incomesCategories.find((c) => c.category_id === category.income_category_id)?.name}</td>
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
                                    {incomesCategories.map((category) => {
                                        const total = dashboardData?.income_data
                                            .filter((expense) => expense.income_category_id === category.category_id)
                                            .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                                        return (
                                            <tr>
                                                <td className='border border-slate-300 px-2'>{category.name}</td>
                                                <td className='border border-slate-300 px-2'>S/.{total}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {showExpenseModal && (
                <TransactionModal
                    onSubmit={handleAddExpense}
                    type="expense" // This could be dynamic based on user selection
                    closeModal={() => setShowExpenseModal(false)}
                    categories={expensesCategories}
                />
            )}

            {showIncomeModal && (
                <TransactionModal
                    onSubmit={handleAddIncome}
                    type="income" // This could be dynamic based on user selection
                    closeModal={() => setShowIncomeModal(false)}
                    categories={incomesCategories}
                />
            )}
        </main>
    );
}
