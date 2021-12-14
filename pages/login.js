import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';

const AUTH_USER = gql`
    mutation AuthenticateUser($authenticateUserInput: AuthenticateInput) {
        authenticateUser(input: $authenticateUserInput) {
            token
        }
    }
`;

const Login = () => {

    const router = useRouter();

    const [message, setMessage] = useState(null);
    const [authenticateUser] = useMutation(AUTH_USER);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("The email address is not valid")
                .required("The email is a required field"),
            password: Yup.string()
                .required("The password is a required field")
        }),
        onSubmit: async (values) => {
            const { email, password } = values;

            try {
                const { data } = await authenticateUser({
                    variables: {
                        authenticateUserInput: {
                            email,
                            password
                        }
                    }
                });

                const { token } = data.authenticateUser;
                localStorage.setItem("token", token);

                setMessage("Authenticating user...");

                setTimeout(() => {
                    setMessage(null);
                    router.push("/");
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
                <h1 className="text-center text-2xl text-white font-light">Login</h1>
                {message && showMessage()}
                <div className="flex justify-center mt-5">
                    <div className="w-full max-w-sm">
                        <form
                            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                            onSubmit={formik.handleSubmit}>
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
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
                            <input type="submit"
                                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                value="Log In" />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Login;