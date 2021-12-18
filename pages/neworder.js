import React, { useContext } from 'react';
import Layout from '../components/Layout';

import AssignClient from '../components/orders/AssignClient';
import AssignProducts from '../components/orders/AssignProducts';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';

import OrderContext from '../context/orders/OrderContext';

const NewOrder = () => {

    // Use context and extract values and functions
    const orderContext = useContext(OrderContext);
    const { client, products, total } = orderContext;

    const validateOrder = () => {
        return !products.every((product) => product.quantity > 0) ||
            total === 0 ||
            client.length === 0 ?
            " opacity-50 cursor-not-allowed " :
            ""
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Order</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <AssignClient />
                    <AssignProducts />
                    <OrderSummary />
                    <Total />

                    <button
                        type='button'
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
                    >
                        Register Product
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default NewOrder;