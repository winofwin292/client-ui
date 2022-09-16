import React, { memo, useState } from "react";
import validator from "validator";

function ContactForm(props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");

    const handleClick = (e) => {
        e.preventDefault();

        if (!name || !phone || !email) {
            alert("Vui lòng điền thông tin vào biểu mẫu");
            return;
        }

        if (!validator.isMobilePhone(phone, "vi-VN")) {
            alert("Vui lòng nhập số điện thoại hợp lệ!");
            setPhone("");
            return;
        }

        if (!validator.isEmail(email)) {
            alert("Vui lòng nhập email hợp lệ!");
            setEmail("");
            return;
        }

        const data = {
            name,
            phone,
            email,
            note,
            subject: props.subject,
        };
        //call api
        console.log(data);
    };
    return (
        <form className="space-y-4">
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Họ và tên:
                </label>
                <input
                    id="email"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                    placeholder="Nguyễn Văn A"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label
                    htmlFor="subject"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Số điện thoại:
                </label>
                <input
                    type="text"
                    id="subject"
                    className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                    placeholder="0901234567"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="sm:col-span-2">
                <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                    Ghi chú:
                </label>
                <textarea
                    id="message"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Giờ có thể liên hệ, phương thức liên hệ chính (số điện thoại, email),..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
            </div>
            <button
                // type="submit"
                className="text-white w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                onClick={(e) => handleClick(e)}
            >
                Gửi
            </button>
        </form>
    );
}

export default memo(ContactForm);
