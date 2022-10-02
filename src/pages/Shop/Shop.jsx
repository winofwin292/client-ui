import React, { memo, useEffect, useState, useRef } from "react";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ProductList } from "components/common/ProductList";
import { ShopNav } from "components/common/ShopNav";
import { ShopCart } from "components/common/ShopCart";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

import { products } from "components/common/ProductList/productData";

function Shop() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();

    const [countCart, setCountCart] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [data, setData] = useState(products);
    const dataRef = useRef(products);

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "shop");
        const myCart = JSON.parse(localStorage.getItem("myCart")) || {
            cart: [],
        };
        setCountCart(myCart.cart.length);
        localStorage.setItem("myCart", JSON.stringify(myCart));
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <ShopNav
                setData={setData}
                dataRef={dataRef}
                countCart={countCart}
                setCartOpen={setCartOpen}
            />
            <ProductList data={data} setCountCart={setCountCart} />
            <Footer />
            {/* <ContactDialog cTDState={cTDState} setCTDState={setCTDState} /> */}
            <ShopCart
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                setCountCart={setCountCart}
            />
        </div>
    );
}

export default memo(Shop);
