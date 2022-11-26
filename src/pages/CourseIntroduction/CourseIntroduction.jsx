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

import { Loading } from "components/common/Loading";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
// import { useTranslation } from "react-i18next";

import courseApi from "api/Course/courseApi";

const TopNav = lazy(() => import("components/common/TopNav/TopNav"));
const Footer = lazy(() => import("components/common/Footer/Footer"));
const CourseList = lazy(() =>
    import("components/common/CourseList/CourseList")
);
const ScrollTopButton = lazy(() =>
    import("components/common/ScrollTopButton/ScrollTopButton")
);

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function CourseIntroduction() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [darkMode, setDarkMode] = useState(false);

    const [data, setData] = useState([]);
    const [currData, setCurrData] = useState([]);

    const [count, setCount] = useState(0);
    const [page, setPage] = useState(1);
    const PER_PAGE = 8;

    const getData = useCallback(async () => {
        const response = await courseApi.getAll();
        if (response.status === 200) {
            setData(response.data);
            setCount(Math.ceil(response.data.length / PER_PAGE));
            setCurrData(response.data.slice(0, PER_PAGE));
        } else {
            console.log(response.data);
        }
    }, []);

    // const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "courseIntroduction");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Khóa học";
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
                <CourseList data={currData} />
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
                <ScrollTopButton />
            </Suspense>
        </div>
    );
}

export default memo(CourseIntroduction);
