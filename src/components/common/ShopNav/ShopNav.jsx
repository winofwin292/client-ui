import React, {
    useState,
    memo,
    useRef,
    Fragment,
    useCallback,
    useEffect,
} from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { Listbox, Transition } from "@headlessui/react";

import categoryApi from "api/Category/categoryApi";

function ShopNav(props) {
    const [condition, setCondition] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const buttonRef = useRef();

    const getData = useCallback(async () => {
        const response = await categoryApi.getAll();
        if (response.status === 200) {
            setCategories(response.data);
            return true;
        } else {
            return false;
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleFilter = (e) => {
        e.preventDefault();
        let newData = [];
        if (condition.length === 0) {
            newData.push(...props.dataRef);
        } else {
            condition.forEach((item) => {
                newData.push(
                    ...props.dataRef.filter((obj) => obj.Category.id === item)
                );
            });
        }

        if (keyword) {
            newData = newData.filter((item) =>
                item.name.toLowerCase().includes(keyword.toLowerCase())
            );
        }

        props.setData(newData);
        props.setCount(Math.ceil(newData.length / props.perPage));
        props.setCurrData(newData.slice(0, props.perPage));
        props.setPage(0);

        if (e.target.id === "filter-button") buttonRef.current.click();
    };

    const handleOpenCart = () => {
        props.setCartOpen(true);
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <header className="relative bg-white dark:bg-gray-900">
                <nav
                    aria-label="Top"
                    className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                >
                    <div className="ml-auto flex items-center text-gray-700 dark:text-white md:hidden">
                        <div className="flex min-w-fit">
                            <a
                                href={"/shop/tracking"}
                                className="mt-1 bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-200 rounded-full dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                Tra cứu đơn hàng
                            </a>
                        </div>
                        <div className="ml-4 w-full flex flex-row-reverse">
                            <button
                                onClick={handleOpenCart}
                                className="group -m-2 flex items-center p-2"
                            >
                                <ShoppingBagIcon
                                    className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-white group-hover:text-gray-500"
                                    aria-hidden="true"
                                />
                                <span className="ml-2 mt-1 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-white dark:group-hover:text-gray-200">
                                    {props.countCart}
                                </span>
                                <span className="sr-only">
                                    items in cart, view bag
                                </span>
                            </button>
                        </div>

                        {/* Cart */}
                    </div>

                    <form className="flex mt-4 items-center md:hidden">
                        <label htmlFor="voice-search" className="sr-only">
                            Tìm kiếm
                        </label>
                        <div className="relative w-full">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="keyword"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Tìm kiếm sách"
                                required
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            id="search-button"
                            onClick={(e) => handleFilter(e)}
                            className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <svg
                                className="mr-1 ml-1 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                ></path>
                            </svg>
                        </button>
                    </form>

                    {/* <div className="border-b border-gray-200"> */}
                    <div className="flex h-16 items-center">
                        <form className="md:flex items-center hidden mr-4">
                            <label htmlFor="voice-search" className="sr-only">
                                Tìm kiếm
                            </label>
                            <div className="relative w-full">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="keyword"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Tìm kiếm sách"
                                    required
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                id="search-button"
                                onClick={(e) => handleFilter(e)}
                                className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-full border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="mr-1 ml-1 w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    ></path>
                                </svg>
                            </button>
                        </form>

                        {/* <!-- Dropdown menu --> */}
                        <br />

                        <Listbox
                            value={condition}
                            onChange={setCondition}
                            multiple
                        >
                            <div className="relative mt-1 z-10">
                                <Listbox.Button
                                    className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left dark:text-white"
                                    ref={buttonRef}
                                >
                                    <span className="block truncate">
                                        Chọn loại tài liệu
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon
                                            className="h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Listbox.Button>
                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute min-w-max mt-1 max-h-60 overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {categories.map((category, index) => (
                                            <Listbox.Option
                                                key={index}
                                                className="relative text-gray-900 hover:bg-amber-100 hover:text-amber-900 dark:text-white cursor-default select-none py-2 dark:hover:bg-gray-400 dark:hover:text-white pl-10 pr-4"
                                                value={category.id}
                                            >
                                                <span
                                                    className={
                                                        condition.includes(
                                                            category.id
                                                        )
                                                            ? "block font-semibold"
                                                            : "block font-normal"
                                                    }
                                                >
                                                    {category.name}
                                                </span>
                                                {condition.includes(
                                                    category.id
                                                ) ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </Listbox.Option>
                                        ))}
                                        <div className="px-2 w-full flex justify-between">
                                            <button
                                                id="filter-button"
                                                onClick={(e) => handleFilter(e)}
                                                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                            >
                                                Lọc
                                            </button>
                                        </div>
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>

                        <div className="ml-auto md:flex items-center text-gray-700 dark:text-white hidden">
                            <div className="ml-4 flow-root lg:ml-6">
                                <button
                                    onClick={handleOpenCart}
                                    className="group -m-2 flex items-center p-2"
                                >
                                    <ShoppingBagIcon
                                        className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-white group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="ml-2 mt-1 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-white dark:group-hover:text-gray-200">
                                        {props.countCart}
                                    </span>
                                    <span className="sr-only">
                                        items in cart, view bag
                                    </span>
                                </button>
                            </div>
                            <div className="flex lg:ml-6">
                                <a
                                    href={"/shop/tracking"}
                                    className="mt-1 bg-white hover:bg-gray-100 text-gray-800 py-2 px-4 border border-gray-200 rounded-full dark:bg-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Tra cứu đơn hàng
                                </a>
                            </div>
                            {/* Cart */}
                        </div>
                    </div>
                    {/* </div> */}
                </nav>
            </header>
        </div>
    );
}

export default memo(ShopNav);
