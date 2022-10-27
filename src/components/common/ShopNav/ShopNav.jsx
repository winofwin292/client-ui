import React, {
    useState,
    memo,
    useRef,
    Fragment,
    useCallback,
    useEffect,
} from "react";
import {
    MagnifyingGlassIcon,
    ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import { Listbox, Transition } from "@headlessui/react";

import categoryApi from "api/Category/categoryApi";

function ShopNav(props) {
    const [condition, setCondition] = useState([]);
    const [categories, setCategories] = useState([]);
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
        // e.preventDefault();

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

        props.setData(newData);
        buttonRef.current.click();
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
                    {/* <div className="border-b border-gray-200"> */}
                    <div className="flex h-16 items-center">
                        {/* <!-- Dropdown menu --> */}

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
                                                onClick={handleFilter}
                                                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                            >
                                                Lọc
                                            </button>
                                        </div>
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>

                        <div className="ml-auto flex items-center text-gray-700 dark:text-white">
                            Search
                            <div className="flex lg:ml-6">
                                <a
                                    href="/shop/"
                                    className="p-2 text-gray-400 dark:text-white hover:text-gray-500"
                                >
                                    <span className="sr-only">Search</span>
                                    <MagnifyingGlassIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </a>
                            </div>
                            {/* Cart */}
                            <div className="ml-4 flow-root lg:ml-6">
                                <button
                                    onClick={handleOpenCart}
                                    className="group -m-2 flex items-center p-2"
                                >
                                    <ShoppingBagIcon
                                        className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-white group-hover:text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-white dark:group-hover:text-gray-200">
                                        {props.countCart}
                                    </span>
                                    <span className="sr-only">
                                        items in cart, view bag
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* </div> */}
                </nav>
            </header>
        </div>
    );
}

export default memo(ShopNav);
