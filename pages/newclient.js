import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from 'next/router';

const NEW_CLIENT = gql`
    mutation NewClient($input: ClientInput) {
        newClient(input: $input) {
            id
            firstName
            lastName
            company
            email
            phone
        }
    }
`;

const GET_CLIENTS_USER = gql`
  query GetClientsBySeller {
    getClientsBySeller {
      id
      firstName
      lastName
      company
      email
      phone
    }
  }
`;

const NewClient = () => {

    const router = useRouter();

    const [message, setMessage] = useState(null);

    const [newClient] = useMutation(NEW_CLIENT, {
        update(cache, { data: { newClient } }) {
            // Get the object of cache to update
            const { getClientsBySeller } = cache.readQuery({ query: GET_CLIENTS_USER });

            // Rewrite the cache
            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    getClientsBySeller: [...getClientsBySeller, newClient]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            company: "",
            email: "",
            phone: ""
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required("The first name is a required field"),
            lastName: Yup.string()
                .required("The last name is a required field"),
            company: Yup.string()
                .required("The company is a required field"),
            email: Yup.string()
                .email("The email address is not valid")
                .required("The email is a required field")
        }),
        onSubmit: async (values) => {
            const { firstName, lastName, company, email, phone } = values;

            try {
                const { data } = await newClient({
                    variables: {
                        input: {
                            firstName,
                            lastName,
                            company,
                            email,
                            phone
                        }
                    }
                });

                router.push("/");
            } catch (error) {
                setMessage(error.message);

                setTimeout(() => {
                    setMessage(null);
                }, 2000);
            }
        }
    });

    const showMessage = () => {
        return (
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{message}</p>
            </div>
        )
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">New Client</h1>
            {message && showMessage()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                id="firstName"
                                type="text"
                                placeholder="Client's First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.firstName && formik.errors.firstName ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.firstName}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                id="lastName"
                                type="text"
                                placeholder="Client's Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.lastName && formik.errors.lastName ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.lastName}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                                Company
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                id="company"
                                type="text"
                                placeholder="Client's Company"
                                value={formik.values.company}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.company && formik.errors.company ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.company}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                id="email"
                                type="email"
                                placeholder="Client's Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                        </div>
                        {formik.touched.email && formik.errors.email ? (
                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                <p className="font-bold">Error</p>
                                <p>{formik.errors.email}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                id="phone"
                                type="tel"
                                placeholder="Client's Phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} />
                        </div>
                        <input
                            type="submit"
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-ball hover:bg-gray-900'
                            value="Register Client"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default NewClient;