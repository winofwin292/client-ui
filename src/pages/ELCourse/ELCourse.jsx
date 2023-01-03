import React, { memo, useState, useEffect, useCallback } from "react";

import { IconButton, Button } from "@mui/material";
import Grid from "@mui/material/Grid";

import { SendOutlined } from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import moment from "moment";

import { useParams } from "react-router-dom";
import Announcement from "./components/Announcement/Announcement";
import CreateLesson from "./components/CreateLesson/CreateLesson";

import courseApi from "api/Course/courseApi";

import "./ELCourse.css";

const posts = [
    {
        authorId: 1,
        content: "Nội dung",
        date: new Date().toISOString(),
        image: "https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png",
        name: "Tên",
    },
    {
        authorId: 1,
        content: "Nội dung 1",
        date: new Date().toISOString(),
        image: "https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png",
        name: "Tên 1",
    },
    {
        authorId: 1,
        content: "Nội dung 2",
        date: new Date().toISOString(),
        image: "https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png",
        name: "Tên 2",
    },
];

function ELCourse() {
    const [data, setData] = useState({});
    const [announcementContent, setAnnouncementContent] = useState("");
    const [createDialogState, setCreateDialogState] = useState({
        state: false,
        courseId: "",
    });
    // const [posts, setPosts] = useState([]);
    // const [user, loading, error] = useAuthState(auth);

    const { courseId } = useParams();

    const getData = useCallback(async (courseId) => {
        const response = await courseApi.getAnnouncement({
            courseId: parseInt(courseId),
        });
        if (response.status === 200) {
            setData(response.data);
            console.log(response.data);
            return true;
        } else {
            return false;
        }
    }, []);

    useEffect(() => {
        getData(courseId);
    }, [getData, courseId]);

    const handleCreateLesson = (e, courseId) => {
        setCreateDialogState({
            state: true,
            courseId: courseId,
        });
    };

    return (
        <>
            <div className="class">
                <div className="class__nameBox">
                    {/* <div className="class__name">{classData?.name}</div> */}
                    <div className="class__name">{data?.course?.name}</div>
                </div>
                <div className="class__announce">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                style={{ color: "white" }}
                                startIcon={<LibraryBooksIcon />}
                                onClick={(e) => handleCreateLesson(e, courseId)}
                            >
                                Tạo mới bài học
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                style={{ color: "white" }}
                                startIcon={<HistoryEduIcon />}
                            >
                                Tạo mới đề kiểm tra
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                <div className="class__announce">
                    <img
                        src="https://www.seekpng.com/png/detail/110-1100707_person-avatar-placeholder.png"
                        alt="ảnh"
                    />
                    <input
                        type="text"
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="Announce something to your class"
                    />
                    <IconButton
                    // onClick={createPost}
                    >
                        <SendOutlined />
                    </IconButton>
                </div>
                {posts?.map((post, index) => (
                    <Announcement
                        key={index}
                        authorId={post.authorId}
                        content={post.content}
                        date={post.date}
                        image={post.image}
                        name={post.name}
                    />
                ))}
            </div>
            <CreateLesson
                open={createDialogState}
                setOpen={setCreateDialogState}
            />
        </>
    );
}
export default memo(ELCourse);
