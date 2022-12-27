import { IconButton } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";
import moment from "moment";
import React, { memo, useState, useEffect } from "react";

import ELNavBar from "components/common/ELNavBar/ELNavBar";
import CreateClass from "pages/ELTeacherHome/components/CreateClass/CreateClass";
import JoinClass from "pages/ELTeacherHome/components/JoinClass/JoinClass";

// import { useAuthState } from "react-firebase-hooks/auth";
// import { useHistory, useParams } from "react-router-dom";
import Announcement from "./components/Announcement/Announcement";
// import { auth, db } from "../firebase";
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
    // const [classData, setClassData] = useState({});
    const [announcementContent, setAnnouncementContent] = useState("");
    // const [posts, setPosts] = useState([]);
    // const [user, loading, error] = useAuthState(auth);

    // const [createState, setCreateState] = useState(false);
    // const [joinState, setJoinState] = useState(false);
    // const { id } = useParams();

    // useEffect(() => {
    //     // reverse the array
    //     let reversedArray = classData?.posts?.reverse();
    //     setPosts(reversedArray);
    // }, [classData]);

    // const createPost = async () => {
    //     try {
    //         const myClassRef = await db.collection("classes").doc(id).get();
    //         const myClassData = await myClassRef.data();
    //         console.log(myClassData);
    //         let tempPosts = myClassData.posts;
    //         tempPosts.push({
    //             authorId: user.uid,
    //             content: announcementContent,
    //             date: moment().format("MMM Do YY"),
    //             image: user.photoURL,
    //             name: user.displayName,
    //         });
    //         myClassRef.ref.update({
    //             posts: tempPosts,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         alert(
    //             `There was an error posting the announcement, please try again!`
    //         );
    //     }
    // };

    // useEffect(() => {
    //     db.collection("classes")
    //         .doc(id)
    //         .onSnapshot((snapshot) => {
    //             const data = snapshot.data();
    //             if (!data) history.replace("/");
    //             console.log(data);
    //             setClassData(data);
    //         });
    // }, []);

    // useEffect(() => {
    //     if (loading) return;
    //     if (!user) history.replace("/");
    // }, [loading, user]);

    return (
        <>
            {/* <ELNavBar
                setCreateState={setCreateState}
                setJoinState={setJoinState}
            /> */}
            <div className="class">
                <div className="class__nameBox">
                    {/* <div className="class__name">{classData?.name}</div> */}
                    <div className="class__name">"classData?.name"</div>
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
            {/* <CreateClass
                createState={createState}
                setCreateState={setCreateState}
            />
            <JoinClass joinState={joinState} setJoinState={setJoinState} /> */}
        </>
    );
}
export default ELCourse;
