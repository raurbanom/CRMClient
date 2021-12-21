import React from 'react';

import Layout from "../components/Layout";
import Product from '../components/Product';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_PRODUCTS = gql`
    query GetProducts {
        getProducts {
            id
            name
            price
            stock
        }
    }
`;

const Products = () => {

    const { data, loading, error } = useQuery(GET_PRODUCTS);

    if (loading) return "Loading...";

    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Products</h1>
                <Link href="/newproduct">
                    <a className='bg-gray-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-900 mb-3 uppercase font-bold w-full lg:w-auto text-center'>New Product</a>
                </Link>
                <div className='overflow-x-scroll'>
                    <table className='table-auto shadow-md mt-10 w-full w-lg'>
                        <thead className='bg-gray-800'>
                            <tr className='text-white'>
                                <th className='w-1/5 py-2'>Name</th>
                                <th className='w-1/5 py-2'>Stock</th>
                                <th className='w-1/5 py-2'>Price</th>
                                <th className='w-1/5 py-2'>Delete</th>
                                <th className='w-1/5 py-2'>Edit</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white'>
                            {data.getProducts.map((product) =>
                                <Product
                                    key={product.id}
                                    product={product} />
                            )}
                        </tbody>
                    </table>
                </div>
            </Layout>
        </div>
    );
}

export default Products;