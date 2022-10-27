import React, { memo, useEffect, useState, useCallback } from "react";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ProductList } from "components/common/ProductList";
import { ShopNav } from "components/common/ShopNav";
import { ShopCart } from "pages/ShopCart";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

import productApi from "api/Product/productApi";

function Shop() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();

    const [countCart, setCountCart] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [data, setData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);

    // const { t } = useTranslation();

    const getData = useCallback(async () => {
        const response = await productApi.getAll();
        if (response.status === 200) {
            setData(response.data);
            setDataFilter(response.data);
            return true;
        } else {
            return false;
        }
    }, []);

    useEffect(() => {
        document.title = "Cửa hàng tài liệu";
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

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
                dataRef={dataFilter}
                countCart={countCart}
                setCartOpen={setCartOpen}
            />
            <ProductList data={data} setCountCart={setCountCart} />
            <Footer />
            <ShopCart
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                setCountCart={setCountCart}
            />
        </div>
    );
}

export default memo(Shop);
