import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';

import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from 'sweetalert2';

import AssignClient from '../components/orders/AssignClient';
import AssignProducts from '../components/orders/AssignProducts';
import OrderSummary from '../components/orders/OrderSummary';
import Total from '../components/orders/Total';

import OrderContext from '../context/orders/OrderContext';

const NEW_ORDER = gql`
    mutation NewOrder($input: OrderInput) {
        newOrder(input: $input) {
            id
        }
    }
`;

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

const NewOrder = () => {

    const router = useRouter();
    const [message, setMessage] = useState(null);

    // Use context and extract values and functions
    const orderContext = useContext(OrderContext);
    const { client, products, total } = orderContext;

    const [newOrder] = useMutation(NEW_ORDER, {
        update(cache, { data: { newOrder } }) {
            // Get the object of cache to update
            const { getOrdersBySeller } = cache.readQuery({ query: GET_ORDERS });

            // Rewrite the cache
            cache.writeQuery({
                query: GET_ORDERS,
                data: {
                    getOrdersBySeller: [...getOrdersBySeller, newOrder]
                }
            })
        }
    });

    const validateOrder = () => {
        return !products.every((product) => product.quantity > 0) ||
            total === 0 ||
            client.length === 0 ?
            " opacity-50 cursor-not-allowed " :
            ""
    };

    const createNewOrder = async () => {
        const orderDetail = products.map(({ __typename, stock, ...product }) => product);

        try {
            const { data } = await newOrder({
                variables: {
                    input: {
                        client: client.id,
                        total,
                        orderDetail
                    }
                }
            });

            router.push("/orders");

            Swal.fire({
                title: 'Created!',
                text: "The order was successfully created",
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        } catch (error) {
            setMessage(error.message);

            setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
    };

    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Order</h1>
            {message && showMessage()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <AssignClient />
                    <AssignProducts />
                    <OrderSummary />
                    <Total />

                    <button
                        type='button'
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
                        onClick={() => createNewOrder()}
                    >
                        Register Product
                    </button>
                </div>
            </div>
        </Layout>
    );
}

export default NewOrder;