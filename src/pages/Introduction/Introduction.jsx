import React, { memo, useEffect, useState } from "react";
import { TopNav } from "components/common/TopNav";
import { CallToAction } from "components/common/CallToAction";
import { Footer } from "components/common/Footer";
import { ContactDialog } from "components/common/ContactDialog";
import { HeroSection } from "components/common/HeroSection";
import { Content } from "components/common/Content";
import { Blockquote } from "components/common/Blockquote";
import { ScrollTopButton } from "components/common/ScrollTopButton";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

//i18next translate
// import { useTranslation } from "react-i18next";

function Introduction() {
    //controller có thể lấy layout phục vụ cho chức năng thêm
    // eslint-disable-next-line
    const [controller, dispatch] = useMaterialUIController();
    // const { direction, layout, openConfigurator, darkMode } = controller;
    const [cTDState, setCTDState] = useState({
        isOpen: false,
        subject: "",
    });

    // const { t } = useTranslation();

    useEffect(() => {
        setLayout(dispatch, "introduction");
    }, [dispatch]);

    useEffect(() => {
        document.title = "Giới thiệu chung";
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <HeroSection />
            <Content
                title="Không ngừng đổi mới"
                textContent={[
                    "Sau gần 5 năm thành lập, chúng tôi không ngừng chuyển đổi nội tại, tiên phong chuyển đổi số và áp dụng công nghệ, cập nhật những xu hướng mới nhất nhằm cung cấp giải pháp tiên tiến, khơi mở những giá trị, đáp ứng những nhu cầu mới của thời đại.",
                ]}
            />
            <Content
                title="Tích hợp công nghệ hỗ trợ học tập"
                textContent={[
                    "Các phần mềm iTools, Oxford Online Practice hỗ trợ tối đa việc học tại lớp và ôn luyện tại nhà.",
                ]}
                alignRight
            />
            {/* <Content />
            <Content alignRight /> */}
            <Blockquote
                name="Trần Văn An"
                position="Giám đốc trung tâm"
                quote="Chúng tôi không ngừng đào tạo nâng cao nghiệp vụ và ứng dụng Khung Năng Lực Giảng Dạy (Teaching Competency Framework) để kiểm soát chất lượng giảng dạy của từng giáo viên/trợ giảng trong hệ thống."
            />
            <CallToAction setCTDState={setCTDState} />
            <Footer />
            <ContactDialog cTDState={cTDState} setCTDState={setCTDState} />
            <ScrollTopButton />
        </div>
    );
}

export default memo(Introduction);
