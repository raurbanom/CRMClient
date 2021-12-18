import React, { useContext, useState, useEffect } from 'react';

import OrderContext from '../../context/orders/OrderContext';

const ProductSummary = ({ product }) => {

    const [quantity, setQuantity] = useState(0);

    const orderContext = useContext(OrderContext);
    const { quantityProducts, updateTotal } = orderContext;

    useEffect(() => {
        updateQuantity();
        updateTotal();
    }, [quantity]);

    const updateQuantity = () => {
        const newProduct = { ...product, quantity: Number(quantity) };

        quantityProducts(newProduct);
    }

    const { name, price } = product;

    return (
        <div className='md:flex md:justify-between md:items-center mt-5'>
            <div className='md:w-2/4 mb-2 md:mb-0'>
                <p className='text-sm'>{name}</p>
                <p>$ {price}</p>
            </div>
            <input
                type="number"
                placeholder='Quantity'
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-1 md:ml-4'
                onChange={(evt) => setQuantity(evt.target.value)} />
        </div>
    );
}

export default ProductSummary;