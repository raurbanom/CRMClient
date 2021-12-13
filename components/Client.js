import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import { getRedirectStatus } from 'next/dist/lib/load-custom-routes';

const DELETE_CLIENT = gql`
    mutation DeleteClient($id: ID!) {
        deleteClient(id: $id)
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

const Client = ({ client }) => {
    const [deleteClient] = useMutation(DELETE_CLIENT, {
        update(cache) {
            const { getClientsBySeller } = cache.readQuery({
                query: GET_CLIENTS_USER
            });

            cache.writeQuery({
                query: GET_CLIENTS_USER,
                data: {
                    getClientsBySeller: getClientsBySeller.filter((client) => {
                        return client.id !== id;
                    })
                }
            })
        }
    });

    const { firstName, lastName, company, email, id } = client;

    const confirmDeleteClient = (id) => {
        Swal.fire({
            title: "Are you sure you want to delete this client?",
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
                    const { data } = await deleteClient({
                        variables: {
                            id
                        }
                    })

                    // Show alert
                    Swal.fire(
                        'Deleted!',
                        data.deleteClient,
                        'success'
                    )
                } catch (error) {
                    console.log(error);
                }

            }
        })
    }
    return (
        <tr >
            <td className='border px-4 py-2'>{firstName} {lastName}</td>
            <td className='border px-4 py-2'>{company}</td>
            <td className='border px-4 py-2'>{email}</td>
            <td className='border px-4 py-2'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase font-bold'
                    onClick={() => confirmDeleteClient(id)}
                >

                    Delete
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
}

export default Client;