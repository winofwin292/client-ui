import React, { memo } from "react";

const exampleQuestion = [
    {
        question: "Làm cách nào để tôi có thể được tư vấn",
        answer: "Bạn có thể nhấn vào nút 'Để lại thông tin' bên dưới mục này, sau đó điền đầy đủ thông tin cá nhân. Nhân viên của chúng tôi sẽ liên hệ cho bạn ngay khi nhận được yêu cầu.",
    },
    {
        question: "Khi đặt mua tài liệu, bao lâu thì tôi có thể nhân được hàng",
        answer: "Thời gian nhận hàng từ 3-5 ngày sau khi đơn hàng được xác nhận.",
    },
    {
        question: "Làm thế nào để tôi có thể đăng ký khóa học",
        answer: "Tại trang chi tiết của mỗi khóa học, bạn có thể để lại thông tin hoặc trực tiếp đến trung tâm tại địa chỉ 411, Đường 30 Tháng 4, Hưng Lợi, Ninh Kiều, Cần Thơ để đăng ký.",
    },
    {
        question: "Làm thế nào để tôi thanh toán khi đặt mua tài liệu",
        answer: "Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận hàng.",
    },
];

const QuestionIcon = () => {
    return (
        <svg
            className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
};

function FAQ(props) {
    const allQuestions = props.question || exampleQuestion;
    const columnQuestion = [
        allQuestions.slice(0, allQuestions.length / 2),
        allQuestions.slice(allQuestions.length / 2),
    ];
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-8 lg:px-6">
                <h2 className="mb-8 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                    Câu hỏi thường gặp
                </h2>
                <div className="grid pt-8 text-left border-t border-gray-200 md:gap-16 dark:border-gray-700 md:grid-cols-2">
                    {columnQuestion.map((questions, index) => (
                        <div key={index}>
                            {questions.map((question, index) => (
                                <div className="mb-10" key={index}>
                                    <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                                        <QuestionIcon />
                                        {question.question}?
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {question.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(FAQ);
