import React from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NEW_PRODUCT = gql`
    mutation NewProduct($input: ProductInput) {
        newProduct(input: $input) {
            id
            name
            stock
            price
            created
        }
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

const NewProduct = () => {
    const router = useRouter();

    const [newProduct] = useMutation(NEW_PRODUCT, {
        update(cache, { data: { newProduct } }) {
            // Get the object of cache to update
            const { getProducts } = cache.readQuery({ query: GET_PRODUCTS });

            // Rewrite the cache
            cache.writeQuery({
                query: GET_PRODUCTS,
                data: {
                    getProducts: [...getProducts, newProduct]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            stock: "",
            price: ""
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .required("The name is a required field"),
            stock: Yup.number()
                .required("The stock is a required field")
                .positive("The stock must be greater than zero")
                .integer("The number must be whole integer"),
            price: Yup.number()
                .required("The price is a required field")
                .positive("The stock must be greater than zero")
        }),
        onSubmit: async (values) => {
            const { name, stock, price } = values;
            try {
                const { data } = await newProduct({
                    variables: {
                        input: {
                            name,
                            stock,
                            price
                        }
                    }
                });

                Swal.fire({
                    title: 'Created!',
                    text: "The product was successfully created",
                    icon: 'success',
                    confirmButtonColor: '#3085d6'
                });

                router.push("/products");
            } catch (error) {
                console.log(error);
            }
        }
    });

    return (
        <>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">New Product</h1>
                <div className='flex justify-center mt-5'>
                    <div className='w-full max-w-lg'>
                        <form
                            className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                            onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="name"
                                    type="text"
                                    placeholder="Product's Name"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </div>
                            {formik.touched.name && formik.errors.name ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.name}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                                    Stock
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="stock"
                                    type="number"
                                    placeholder="Product's Price"
                                    value={formik.values.stock}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </div>
                            {formik.touched.stock && formik.errors.stock ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.stock}</p>
                                </div>
                            ) : null}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                    Price
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="price"
                                    type="number"
                                    placeholder="Product's Price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </div>
                            {formik.touched.price && formik.errors.price ? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.price}</p>
                                </div>
                            ) : null}
                            <input
                                type="submit"
                                className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-ball hover:bg-gray-900'
                                value="Add New Product"
                            />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NewProduct;