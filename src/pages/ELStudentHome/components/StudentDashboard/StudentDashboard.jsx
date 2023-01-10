import React, { useEffect, useState, useCallback, useRef, memo } from "react";

import CourseCard from "../../../../components/common/CourseCard/CourseCard";

import roleInCourseApi from "api/RoleInCourse/roleInCourseApi";
import { getObjectFromCookieValue } from "utils";

import "./StudentDashboard.css";

function StudentDashboard() {
    const [courses, setCourse] = useState([]);
    const userDataRef = useRef(getObjectFromCookieValue("userData"));

    const getData = useCallback(async () => {
        const response = await roleInCourseApi.getCourse({
            username: userDataRef.current.username,
        });
        if (response.status === 200) {
            setCourse(response.data);
            return true;
        } else {
            return false;
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div className="dashboard">
            {courses?.length === 0 ? (
                <div className="dashboard__404">Không có khóa học nào</div>
            ) : (
                <div className="dashboard__classContainer">
                    {courses.map((course, index) => (
                        <CourseCard
                            key={index}
                            teacherName={
                                course.User.last_name +
                                " " +
                                course.User.first_name
                            }
                            // teacherPhoto={course.teacherPhoto}
                            teacherPhoto="https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png"
                            name={course.Course.name}
                            id={course.Course.id}
                            style={{ marginRight: 30, marginBottom: 30 }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
export default memo(StudentDashboard);
