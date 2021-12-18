import React, { useReducer } from 'react';
import OrderContext from './OrderContext';
import OrderReducer from './OrderReducer';

import {
    SELECT_CLIENT,
    SELECT_PRODUCT,
    QUANTITY_PRODUCT,
    UPDATE_TOTAL
} from "../../types";

const OrderState = ({ children }) => {
    const initialState = {
        client: [],
        products: [],
        total: 0
    };

    const [state, dispatch] = useReducer(OrderReducer, initialState);

    // Edit client
    const addClient = (client) => {
        dispatch({
            type: SELECT_CLIENT,
            payload: client
        });
    };

    // Edit the products
    const addProducts = (selectedProducts) => {
        let newState;

        if (state.products.length > 0) {
            newState = selectedProducts.map((product) => {
                const newObject = state.products.find((producState) => producState.id === product.id);

                return {
                    ...product,
                    ...newObject
                };
            });
        } else {
            newState = selectedProducts;
        }

        dispatch({
            type: SELECT_PRODUCT,
            payload: newState
        });
    };

    // Edit the quantities of the products
    const quantityProducts = (newProduct) => {
        dispatch({
            type: QUANTITY_PRODUCT,
            payload: newProduct
        });
    };

    const updateTotal = () => {
        dispatch({
            type: UPDATE_TOTAL
        });
    };

    return (

        <OrderContext.Provider value={{
            client: state.client,
            products: state.products,
            total: state.total,
            addClient,
            addProducts,
            quantityProducts,
            updateTotal
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export default OrderState;