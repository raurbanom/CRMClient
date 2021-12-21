import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
    query GetUser {
        getUser {
            id
            firstName
            lastName
            email
        }
    }
`;

const Header = () => {

    const router = useRouter();
    const { data, loading, error } = useQuery(GET_USER);

    // Avoid get data before has data
    if (loading) return null;

    if (!data) {
        return router.push("/login");
    }

    const { firstName, lastName } = data.getUser;

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    }

    return (
        <div className='sm:flex sm:justify-between mb-6'>
            <h1 className='mr-2 mb-5 lg:mb-0'>Hola: {firstName} {lastName}</h1>
            <button
                onClick={() => logout()}
                type='button'
                className='bg-gray-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-ms'>
                Logout
            </button>
        </div>
    );
}

export default Header;