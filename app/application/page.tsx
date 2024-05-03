'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ICategory, IDashboardData } from '@/interfaces/dashboard.interface';
import DoughnutChart from './components/donut';
import { TransactionModal } from './components/transaction.modal';
import { getDashboardData } from '@/networking/dashboard';

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState<IDashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [expensesCategories, setExpensesCategories] = useState<ICategory[]>([]);
    const [incomesCategories, setIncomesCategories] = useState<ICategory[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        fetchDashboardData();

    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
        setExpensesCategories(data.expense_categories);
        setIncomesCategories(data.income_categories);
        setLoading(false);
    };

    const handleAddTransaction = (transaction: any) => {
        setShowModal(false);
        fetchDashboardData(); // Refresh data after adding transaction
    };

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
                    <button onClick={() => setShowModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add Transaction
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <h2 className="font-semibold text-xl mb-2">Filters</h2>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date!)} className="mb-4 w-full p-2 border rounded" />
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date!)} className="w-full p-2 border rounded" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="font-semibold text-xl mb-2">Expenses & Incomes</h2>
                        {dashboardData ? (
                            <DoughnutChart data={dashboardData} />
                        ) : (
                            <p className="text-gray-500">No data available.</p>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <TransactionModal
                    onSubmit={handleAddTransaction}
                    type="expense" // This could be dynamic based on user selection
                    closeModal={() => setShowModal(false)}
                    categories={selectedCategories}
                />
            )}
        </main>
    );
}
