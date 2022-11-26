import React, {
    memo,
    useEffect,
    useState,
    useCallback,
    lazy,
    Suspense,
} from "react";

import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// import { TopNav } from "components/common/TopNav";
// import { Footer } from "components/common/Footer";
// import { ProductList } from "components/common/ProductList";
// import { ShopNav } from "components/common/ShopNav";
// import { ShopCart } from "pages/ShopCart";
// import { ScrollTopButton } from "components/common/ScrollTopButton";
import { Loading } from "components/common/Loading";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

import productApi from "api/Product/productApi";

const TopNav = lazy(() => import("components/common/TopNav/TopNav"));
const Footer = lazy(() => import("components/common/Footer/Footer"));
const ProductList = lazy(() =>
    import("components/common/ProductList/ProductList")
);
const ShopNav = lazy(() => import("components/common/ShopNav/ShopNav"));
const ShopCart = lazy(() => import("pages/ShopCart/ShopCart"));
const ScrollTopButton = lazy(() =>
    import("components/common/ScrollTopButton/ScrollTopButton")
);

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function Shop() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    const [darkMode, setDarkMode] = useState(false);

    const [countCart, setCountCart] = useState(0);
    const [cartOpen, setCartOpen] = useState(false);
    const [data, setData] = useState([]);
    const [currData, setCurrData] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    // const { t } = useTranslation();

    const getData = useCallback(async () => {
        const response = await productApi.getAll();
        if (response.status === 200) {
            setData(response.data);
            setDataFilter(response.data);
            setCount(Math.ceil(response.data.length / PER_PAGE));
            setCurrData(response.data.slice(0, PER_PAGE));
            return true;
        } else {
            return false;
        }
    }, []);

    useEffect(() => {
        document.title = "Cửa hàng tài liệu";
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setDarkMode(true);
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", function (e) {
                setDarkMode((prev) => !prev);
            });
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        setLayout(dispatch, "shop");
        const myCart = JSON.parse(localStorage.getItem("myCart")) || {
            cart: [],
        };

        const count = myCart.cart.reduce(
            (total, item) => (total += item.quantity),
            0
        );
        setCountCart(count);

        localStorage.setItem("myCart", JSON.stringify(myCart));
    }, [dispatch]);

    const handleChangePage = (e, p) => {
        setPage(p);
        const begin = (p - 1) * PER_PAGE;
        const end = begin + PER_PAGE;
        setCurrData(data.slice(begin, end));
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <Suspense fallback={<Loading />}>
                <TopNav />
                <ShopNav
                    setData={setData}
                    dataRef={dataFilter}
                    countCart={countCart}
                    setCartOpen={setCartOpen}
                    setPage={setPage}
                    setCount={setCount}
                    setCurrData={setCurrData}
                    perPage={PER_PAGE}
                />
                <ProductList data={currData} setCountCart={setCountCart} />

                <div className="bg-white dark:bg-gray-900 flex">
                    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-2 items-center">
                        <ThemeProvider theme={darkMode ? themeD : theme}>
                            <Stack spacing={2}>
                                <Pagination
                                    count={count}
                                    page={page}
                                    showFirstButton
                                    showLastButton
                                    onChange={handleChangePage}
                                />
                            </Stack>
                        </ThemeProvider>
                    </div>
                </div>
                <Footer />
                <ShopCart
                    cartOpen={cartOpen}
                    setCartOpen={setCartOpen}
                    setCountCart={setCountCart}
                />
                <ScrollTopButton />
            </Suspense>
        </div>
    );
}

export default memo(Shop);
