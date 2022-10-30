/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ContactForm from "./ContactForm";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ContactDialog(props) {
    const cancelButtonRef = useRef(null);

    const handleClose = () => {
        props.setCTDState({
            isOpen: false,
            subject: "",
        });
    };

    return (
        <Transition.Root show={props.cTDState.isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={handleClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <section className="bg-white dark:bg-gray-900">
                                    <div className="py-4 lg:py-4 px-4 mx-auto max-w-screen-md">
                                        <div className="bg-white dark:bg-gray-900 flex flex-row-reverse py-0 px-0">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-300 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={handleClose}
                                                ref={cancelButtonRef}
                                            >
                                                <span className="sr-only">
                                                    Close panel
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>

                                        <h2 className="mb-2 mt-2 text-4xl tracking-tight font-medium text-center text-gray-900 dark:text-white">
                                            Thông tin liên hệ
                                        </h2>

                                        <p className="mb-2 lg:mb-4 font-thin text-center text-gray-500 dark:text-gray-400 sm:text-base">
                                            Vui lòng điền vào biểu mẫu bên dưới
                                            và nhấn gửi để nhân viên của chúng
                                            tôi có thể liên hệ cho bạn.
                                        </p>
                                        <ContactForm
                                            subject={props.cTDState.subject}
                                            setNotify={props.setNotify}
                                            setCTDState={props.setCTDState}
                                        />
                                    </div>
                                </section>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default memo(ContactDialog);
