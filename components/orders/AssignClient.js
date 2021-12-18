import React, { useEffect, useState, useContext } from 'react';
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import OrderContext from '../../context/orders/OrderContext';

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


const AssignClient = () => {
  const [client, setClient] = useState([]);
  const orderContext = useContext(OrderContext);
  const { addClient } = orderContext;

  const { data, loading, error } = useQuery(GET_CLIENTS_USER);

  useEffect(() => {
    addClient(client)
  }, [client]);

  const selectClient = (client) => {
    setClient(client);
  };

  if (loading) return null;

  const { getClientsBySeller } = data;

  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>1.- Assign a client to the order</p>
      <Select
        className="mt-3"
        options={getClientsBySeller}
        onChange={(client) => selectClient(client)}
        getOptionValue={(client) => client.id}
        getOptionLabel={(client) => `${client.firstName} ${client.lastName}`}
        placeholder="Find or select the client"
        noOptionsMessage={() => "There are no results"} />
    </>
  );
}

export default AssignClient;