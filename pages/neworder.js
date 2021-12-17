import React, { useContext } from 'react';
import Layout from '../components/Layout';
import AssignClient from '../components/Order/AssignClient';
import OrderContext from '../context/orders/OrderContext';

const NewOrder = () => {

    // Use context and extract values and functions
    const orderContext = useContext(OrderContext);

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Order</h1>
            <AssignClient />
        </Layout>
    );
}

export default NewOrder;