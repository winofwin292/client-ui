import React, { memo } from "react";

const exampleQuestion = [
    {
        question: 'What do you mean by "Figma assets"',
        answer: "You will have access to download the full Figma project including all of the pages, the components, responsive pages, and also the icons, illustrations, and images included in the screens.",
    },
    {
        question: 'What does "lifetime access" exactly mean',
        answer: "Once you have purchased either the design, code, or both packages, you will have access to all of the future updates based on the roadmap, free of charge.",
    },

    {
        question: "How does support work",
        answer: "We're aware of the importance of well qualified support, that is why we decided that support will only be provided by the authors that actually worked on this project. Feel free to contact us and we'll help you out as soon as we can.",
    },

    {
        question: "I want to build more than one project. Is that allowed",
        answer: "You can use Windster for an unlimited amount of projects, whether it's a personal website, a SaaS app, or a website for a client. As long as you don't build a product that will directly compete with Windster either as a UI kit, theme, or template, it's fine. Find out more information by reading the license .",
    },
    {
        question: 'What does "free updates" include',
        answer: "The free updates that will be provided is based on the roadmap that we have laid out for this project. It is also possible that we will provide extra updates outside of the roadmap as well.",
    },
    {
        question: "What does the free version include",
        answer: "The free version of Windster includes a minimal style guidelines, component variants, and a dashboard page with the mobile version alongside it. You can use this version for any purposes, because it is open-source under the MIT license.",
    },
    {
        question: "What is the difference between Windster and Tailwind UI",
        answer: "Although both Windster and Tailwind UI are built for integration with Tailwind CSS, the main difference is in the design, the pages, the extra components and UI elements that Windster includes. Additionally, Windster is a project that is still in development, and later it will include both the application, marketing, and e-commerce UI interfaces.",
    },
    {
        question: "Can I use Windster in open-source projects",
        answer: "Generally, it is accepted to use Windster in open-source projects, as long as it is not a UI library, a theme, a template, a page-builder that would be considered as an alternative to Windster itself. With that being said, feel free to use this design kit for your open-source projects. Find out more information by reading the license.",
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
