import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from "@apollo/client"
import { Formik } from "formik"
import * as Yup from "yup";
import Swal from 'sweetalert2';

const GET_PRODUCT = gql`
    query GetProduct($id: ID!) {
        getProduct(id: $id) {
            id
            name
            stock
            price
        }
    }
`;

const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($id: ID!, $input: ProductInput) {
        updateProduct(id: $id, input: $input) {
            id
            name
            stock
            price
        }
    }
`;

const EditProduct = () => {

    const router = useRouter();
    const { pid } = router?.query;

    const { data, loading, error } = useQuery(GET_PRODUCT, {
        variables: {
            id: pid
        }
    });

    const [updateProduct] = useMutation(UPDATE_PRODUCT);

    const validSchema = Yup.object({
        name: Yup.string()
            .required("The name is a required field"),
        stock: Yup.number()
            .required("The stock is a required field")
            .positive("The stock must be greater than zero")
            .integer("The number must be whole integer"),
        price: Yup.number()
            .required("The price is a required field")
            .positive("The stock must be greater than zero")
    });

    if (loading) return "Loading...";

    if (data && !data.getProduct) {
        return "This action is not allowed";
    }

    const { getProduct } = data;

    const editInfoProduct = async (values) => {
        const { name, stock, price } = values;

        try {
            const { data } = await updateProduct({
                variables: {
                    id: pid,
                    input: {
                        name,
                        stock,
                        price
                    }
                }
            });

            Swal.fire({
                title: 'Updated!',
                text: "The product was successfully updated",
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });

            router.push("/products");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit Product</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={validSchema}
                        enableReinitialize
                        initialValues={getProduct}
                        onSubmit={(values) => {
                            editInfoProduct(values)
                        }}>

                        {(props) => {
                            return (
                                <form
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                    onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="name"
                                            type="text"
                                            placeholder="Product's Name"
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.name && props.errors.name ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.name}</p>
                                            </div>
                                        ) : null
                                    }
                                    < div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                                            Stock
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="stock"
                                            type="number"
                                            placeholder="Product's Stock"
                                            value={props.values.stock}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.stock && props.errors.stock ? (
                                            < div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.stock}</p>
                                            </div>
                                        ) : null
                                    }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                                            Price
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="price"
                                            type="number"
                                            placeholder="Product's Price"
                                            value={props.values.price}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.price && props.errors.price ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.price}</p>
                                            </div>
                                        ) : null
                                    }
                                    <input
                                        type="submit"
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-ball hover:bg-gray-900'
                                        value="Edit Product"
                                    />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout >
    );
}

export default EditProduct;