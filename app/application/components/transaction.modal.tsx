import { ICategory, IExpense, IIncome } from '@/interfaces/dashboard.interface';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

export const TransactionModal = (props: { onSubmit: Function, type: 'income' | 'expense', closeModal: () => void, categories: ICategory[] }) => {
  const [newTransaction, setNewTransaction] = useState<IExpense | IIncome>(props.type === 'income' ? {
    name: '',
    amount: '0',
    date: new Date().toISOString(),
    income_category_id: 0,
  } : {
    name: '',
    amount: '0',
    date: new Date().toISOString(),
    expense_category_id: 0,
  });


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Correctly include `type` from props in the submission object
    props.onSubmit(newTransaction, props.type);
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center' onClick={props.closeModal}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
        <div className='flex flex-col'>
          <label className='font-semibold'>Nombre</label>
          <input type="text" value={newTransaction.name} onChange={e => setNewTransaction({ ...newTransaction, name: e.target.value })} placeholder="Name" className="w-full p-2 border rounded" />
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Monto</label>
          <input type="number" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} placeholder="Amount" className="w-full p-2 border rounded" />
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Fecha</label>
          <ReactDatePicker selected={new Date(newTransaction.date)} onChange={date => setNewTransaction({ ...newTransaction, date: date?.toISOString() || new Date().toISOString() })} className="w-full p-2 border rounded" />
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Categoría</label>
          <select
            value={props.type === 'income' ? (newTransaction as IIncome).income_category_id : (newTransaction as IExpense).expense_category_id}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                ...(props.type === 'income'
                  ? { income_category_id: Number(e.target.value) }
                  : { expense_category_id: Number(e.target.value) }),
              })
            }
            className="w-full p-2 border rounded"
          >
            {props.categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">Submit</button>
      </form>
    </div>
  );
};
