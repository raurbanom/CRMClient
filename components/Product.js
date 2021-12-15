import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from "next/router";

const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;

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

const Product = ({ product }) => {

    const router = useRouter()
    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        update(cache) {
            const { getProducts } = cache.readQuery({
                query: GET_PRODUCTS
            });

            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: getProducts.filter((product) => product.id !== id)
                }
            })
        }
    });

    const { name, price, stock, id } = product;

    const confirmDeleteProduct = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this product?",
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: "No, cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Delete by ID
                    const { data } = await deleteProduct({
                        variables: {
                            id
                        }
                    });

                    // Show alert
                    Swal.fire({
                        title: 'Deleted!',
                        text: data.deleteProduct,
                        icon: 'success',
                        confirmButtonColor: '#3085d6'
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }

    const editProduct = (id) => {
        router.push({
            pathname: "/editProduct/[pid]",
            query: { pid: id },
        });
    }

    return (
        <tr >
            <td className='border px-4 py-2'>{name}</td>
            <td className='border px-4 py-2'>{stock} items</td>
            <td className='border px-4 py-2'>$ {price}</td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => confirmDeleteProduct(id)}>
                    Delete
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => editProduct(id)}>
                    Edit
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Product;