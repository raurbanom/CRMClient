import React from 'react';
import Layout from "../components/Layout";
import Link from 'next/link';

const Orders = () => {
    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Orders</h1>
                <Link href="/neworder">
                    <a className='bg-gray-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-900 mb-3 uppercase'>New Order</a>
                </Link>
            </Layout>
        </div>
    );
}

export default Orders;