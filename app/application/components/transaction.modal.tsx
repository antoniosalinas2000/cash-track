import { ICategory } from '@/interfaces/dashboard.interface';
import { useState } from 'react';

export const TransactionModal = (props: { onSubmit: Function, type: 'income' | 'expense', closeModal: () => void, categories: ICategory[] }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Correctly include `type` from props in the submission object
    props.onSubmit({ amount, date, category, type: props.type });
    setAmount('');
    setDate('');
    setCategory('');
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center'>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-6">
        <div className='flex flex-col'>
          <label className='font-semibold'>Monto</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-full p-2 border rounded" />
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Fecha</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Categoría</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
            {props.categories.map(category => (
              <option key={category.category_id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">Submit</button>
      </form>
    </div>
  );
};
