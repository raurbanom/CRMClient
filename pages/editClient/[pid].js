import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useQuery, useMutation } from "@apollo/client"
import { Form, Formik } from "formik"
import * as Yup from "yup";
import Swal from 'sweetalert2';

const GET_CLIENT = gql`
    query GetClient($id: ID!) {
        getClient(id: $id) {
            firstName
            lastName
            company
            email
            phone
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation UpdateClient($id: ID!, $input: ClientInput) {
        updateClient(id: $id, input: $input) {
            id
            firstName
            lastName
            company
            email
            phone
            created
            seller
        }
    }
`;
const EditClient = () => {

    const router = useRouter();
    const { pid } = router?.query;

    const { data, loading, error } = useQuery(GET_CLIENT, {
        variables: {
            id: pid
        }
    });

    const [updateClient] = useMutation(UPDATE_CLIENT)

    const validSchema = Yup.object({
        firstName: Yup.string()
            .required("The first name is a required field"),
        lastName: Yup.string()
            .required("The last name is a required field"),
        company: Yup.string()
            .required("The company is a required field"),
        email: Yup.string()
            .email("The email address is not valid")
            .required("The email is a required field")
    });

    if (loading) return "Loading...";

    if (data && !data.getClient) {
        return "This action is not allowed";
    }

    const { getClient } = data;
    const editInfoClient = async (values) => {
        const { firstName, lastName, company, email, phone } = values;

        try {
            const { data } = await updateClient({
                variables: {
                    id: pid,
                    input: {
                        firstName,
                        lastName,
                        company,
                        email,
                        phone
                    }
                }
            });

            Swal.fire({
                title: 'Updated!',
                text: "The client was successfully updated",
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });

            router.push("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Edit Client</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={validSchema}
                        enableReinitialize
                        initialValues={getClient}
                        onSubmit={(values) => {
                            editInfoClient(values)
                        }}>

                        {(props) => {
                            return (
                                <form
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                    onSubmit={props.handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                                            First Name
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="firstName"
                                            type="text"
                                            placeholder="Client's First Name"
                                            value={props.values.firstName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.firstName && props.errors.firstName ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.firstName}</p>
                                            </div>
                                        ) : null
                                    }
                                    < div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="lastName"
                                            type="text"
                                            placeholder="Client's Last Name"
                                            value={props.values.lastName}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.lastName && props.errors.lastName ? (
                                            < div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.lastName}</p>
                                            </div>
                                        ) : null
                                    }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="company">
                                            Company
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="company"
                                            type="text"
                                            placeholder="Client's Company"
                                            value={props.values.company}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.company && props.errors.company ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.company}</p>
                                            </div>
                                        ) : null
                                    }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="email"
                                            type="email"
                                            placeholder="Client's Email"
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {
                                        props.touched.email && props.errors.email ? (
                                            <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                                <p className="font-bold">Error</p>
                                                <p>{props.errors.email}</p>
                                            </div>
                                        ) : null
                                    }
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                            Phone
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1"
                                            id="phone"
                                            type="tel"
                                            placeholder="Client's Phone"
                                            value={props.values.phone}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-ball hover:bg-gray-900'
                                        value="Edit Client"
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

export default EditClient;