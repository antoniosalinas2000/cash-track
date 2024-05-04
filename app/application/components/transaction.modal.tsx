import { ICategory, IExpense, IIncome } from '@/interfaces/dashboard.interface';
import Image from 'next/image';
import { useState } from 'react';
import ReactDatePicker from 'react-datepicker';

export const TransactionModal = (props: { transaction?: IIncome | IExpense, onSubmit: Function, type: 'income' | 'expense', closeModal: () => void, categories: ICategory[] }) => {
  const initialState = props.transaction ? props.transaction :
    props.type === 'income'
      ? {
        name: '',
        amount: '0',
        date: new Date().toISOString(),
        income_category_id: 0,
      } : {
        name: '',
        amount: '0',
        date: new Date().toISOString(),
        expense_category_id: 0,
      };

  const [newTransaction, setNewTransaction] = useState<IExpense | IIncome>(initialState);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    props.onSubmit(newTransaction, props.type);
    setLoading(false);
    props.closeModal();
  };

  const handleCategorySelection = (categoryId: number) => {
    const field = props.type === 'income' ? 'income_category_id' : 'expense_category_id';
    setNewTransaction(prev => ({ ...prev, [field]: categoryId }));
  };

  const iconForCategory = (category: ICategory) => {
    switch (category.name) {
      case 'Salidas':
        return '/salidas.svg';
      case 'Comida':
        return '/comida.svg';
      case 'Taxis':
        return '/taxis.svg';
      case 'Suscripciones':
        return '/suscripciones.svg';
      case 'Vicios':
        return '/vicios.svg';
      case 'Regalos':
        return '/regalos.svg';
      case 'Otros':
        return '/otros.svg';
      case 'Trabajo':
        return '/trabajo.svg';
      case 'Freelance':
        return '/freelance.svg';
      case 'Propina':
        return '/propina.svg';
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center' onClick={props.closeModal}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-16 w-1/2 2xl:w-1/4" onClick={(e) => e.stopPropagation()}>
        <h1 className='text-4xl font-semibold w-full text-center'>{props.type === 'income' ? 'Ingreso' : 'Gasto'}</h1>
        <div className='w-full h-[2px] bg-gray-300'></div>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='grid grid-cols-3 w-full gap-4'>
            {props.categories.map((category, index) => (
              <div key={category.category_id} className={`flex flex-col items-center gap-2 ${(index === props.categories.length - 1 && props.type === 'expense') ? 'col-span-3' : 'col-span-1'}`} onClick={() => handleCategorySelection(category.category_id)} style={{ cursor: 'pointer' }}>
                <div className='flex w-12 h-12 2xl:w-16 2xl:h-16 '>
                  <Image src={`/categorias${iconForCategory(category)}`} style={{ objectFit: "contain" }} alt={category.name} width={64} height={64} className={`${props.type === 'income' ? (category.category_id === (newTransaction as IIncome).income_category_id ? 'opacity-100' : 'opacity-30') : (category.category_id === (newTransaction as IExpense).expense_category_id ? 'opacity-100' : 'opacity-30')}`} />
                </div>
                <span className='font-semibold'>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col'>
          <label className='font-semibold'>Nombre</label>
          <input type="text" value={newTransaction.name} onChange={e => setNewTransaction({ ...newTransaction, name: e.target.value })} placeholder="Name" className="w-full p-2 border rounded" />
        </div>
        <div className='flex flex-row gap-4  w-full'>
          <div className='flex flex-col w-full'>
            <label className='font-semibold'>Monto</label>
            <input type="number" value={newTransaction.amount} onChange={e => setNewTransaction({ ...newTransaction, amount: e.target.value })} placeholder="Amount" className="w-full p-2 border rounded" />
          </div>

          <div className='flex flex-col  w-full'>
            <label className='font-semibold'>Fecha</label>
            <ReactDatePicker selected={new Date(newTransaction.date)} onChange={date => setNewTransaction({ ...newTransaction, date: date?.toISOString() || new Date().toISOString() })} className="w-full p-2 border rounded" />
          </div>
        </div>
        <button type="submit" className={`px-4 py-2 ${props.type === 'income' ? 'bg-green-500 hover:bg-green-700' : 'bg-blue-500 hover:bg-blue-700'} text-white rounded w-full flex items-center justify-center`}>
          {loading ? <div className='w-6 h-6 mx-auto animate-spin rounded-full border-b-2 border-white'></div> :  props.transaction ? 'Editar' : 'Agregar' }
        </button>
      </form>
    </div>
  );
};
