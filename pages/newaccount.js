import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NEW_ACCOUNT = gql`
    mutation NewUser($input: UserInput) {
        newUser(input: $input) {
            id
            firstName
            lastName
            email
        }
    }
`;

const NewAccount = () => {
    const [newUser] = useMutation(NEW_ACCOUNT);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required("The first name is a required field"),
            lastName: Yup.string()
                .required("The last name is a required field"),
            email: Yup.string()
                .email("The email address is not valid")
                .required("The email is a required field"),
            password: Yup.string()
                .required("The password is a required field")
                .min(6, "The passwords field must contain at least 6 characters")
        }),
        onSubmit: async (values) => {
            const { firstName, lastName, email, password } = values;

            try {
                const { data } = await newUser({
                    variables: {
                        input: {
                            firstName,
                            lastName,
                            email,
                            password
                        }
                    }
                });

                setMessage(`The user ${data.newUser.firstName} was successfully created`);

                setTimeout(() => {
                    setMessage(null);
                    router.push("/login");
                }, 2000);

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
        <>
            <Layout>
                <h1 className="text-2xl text-white font-light">Create New Account</h1>
                {message && showMessage()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="firstName"
                                    type="text"
                                    placeholder="User's First Name"
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
                                    placeholder="User's Last Name"
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="email"
                                    type="email"
                                    placeholder="User's Email"
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
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                    id="password"
                                    type="password"
                                    placeholder="User's Password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur} />
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div
                                    className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null}
                            <input
                                type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Create Account" />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default NewAccount;