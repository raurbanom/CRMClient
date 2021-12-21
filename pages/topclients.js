import React, { useEffect } from 'react';
import {
    BarChart, Bar, XAxis,
    YAxis, CartesianGrid, Tooltip,
    Legend, ResponsiveContainer
} from 'recharts';

import { gql, useQuery } from "@apollo/client";

import Layout from "../components/Layout"

const TOP_CLIENTS = gql`
    query TopClients {
        topClients {
            client {
                id
                firstName
                lastName
                email
            }
            total
        }
    }
`;

const TopSellers = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(TOP_CLIENTS);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    }, [startPolling, stopPolling])

    if (loading) return "Loading...";

    const { topClients } = data;
    const clientsGraph = [];

    topClients.map((client, index) => {
        clientsGraph[index] = {
            name: `${client.client[0].firstName} ${client.client[0].lastName}`,
            total: client.total
        }
    });

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Top CLients</h1>

            <ResponsiveContainer
                width={"99%"}
                height={550}>
                <BarChart
                    width={600}
                    height={500}
                    data={clientsGraph}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#3182CE" />
                </BarChart>
            </ResponsiveContainer>

        </Layout >
    );
}

export default TopSellers;