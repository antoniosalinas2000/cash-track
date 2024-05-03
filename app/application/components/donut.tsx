import { ICategory, IExpense, IIncome } from '@/interfaces/dashboard.interface';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface ChartData {
  name: string;
  value: number;  // This will hold the percentage value
}

// The props expect an array of either IIncome or IExpense items
const DoughnutChart = (props : { data: IIncome[] | IExpense[], categories : ICategory[] }) => {
  // Get the total amount of all the transactions
  const totalAmount = props.data.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  // Create an array of ChartData objects
  const chartData = props.categories
    .filter((category) => {
    // Filter out categories with no transactions
    return props.data.some((transaction) => {
      if ('income_category_id' in transaction) {
      return transaction.income_category_id === category.category_id;
      } else {
      return transaction.expense_category_id === category.category_id;
      }
    });
    })
    .map((category) => {
    // Filter the transactions by category
    const transactions = props.data.filter((transaction) => {
      if ('income_category_id' in transaction) {
      return transaction.income_category_id === category.category_id;
      } else {
      return transaction.expense_category_id === category.category_id;
      }
      return false;
    });
    // Calculate the total amount of transactions in this category
    const categoryTotal = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    // Calculate the percentage of the total amount
    const percentage = (categoryTotal / totalAmount) * 100;
    return {
      name: category.name,
      value: percentage,
    };
    });


  return (
    <PieChart width={500} height={350}>
      <Pie
        data={chartData}
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        innerRadius={60}
        outerRadius={80}
        fill="#1a1a1a"
        dataKey="value"
      >
        {chartData.map((_, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip formatter={(value: number) => `${value}%`} />
      <Legend />
    </PieChart>
  );
};

export default DoughnutChart;
