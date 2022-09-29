import React, { memo, useEffect, useState, useRef } from "react";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { ProductList } from "components/common/ProductList";
import { ShopNav } from "components/common/ShopNav";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
import { useTranslation } from "react-i18next";

import { products } from "components/common/ProductList/productData";

function Shop() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });
    const [data, setData] = useState(products);
    const dataRef = useRef(products);

    const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "shop");
    }, [dispatch]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <ShopNav setData={setData} dataRef={dataRef} />
            <ProductList data={data} />
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
        </div>
    );
}

export default memo(Shop);
