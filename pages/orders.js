import React from 'react';
import { gql, useQuery } from "@apollo/client"
import Link from 'next/link';

import Layout from "../components/Layout";
import Order from '../components/Order';

const GET_ORDERS = gql`
    query GetOrdersBySeller {
        getOrdersBySeller {
            id
            orderDetail {
                id
                quantity
                name
            }
            client {
                id
                firstName
                lastName
                company
                email
                phone
            }
            seller
            total
            state
        }
    }
`;

const Orders = () => {

    const { data, loading, error } = useQuery(GET_ORDERS);

    if (loading) return "Loading...";

    const { getOrdersBySeller } = data;

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Orders</h1>
                <Link href="/neworder">
                    <a className='bg-gray-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-900 mb-3 uppercase w-full lg:w-auto text-center'>New Order</a>
                </Link>
                {
                    getOrdersBySeller.length === 0 ? (
                        <p className='mt-5 text-center text-2xl'>There are no orders yet.</p>
                    ) : (
                        getOrdersBySeller.map((order) => (
                            <Order key={order.id} order={order} />
                        ))
                    )
                }
            </Layout>
        </div>
    );
}

export default Orders;