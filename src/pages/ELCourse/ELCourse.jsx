import React, { memo, useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import Announcement from "./components/Announcement/Announcement";
import CreateLesson from "./components/CreateLesson/CreateLesson";

import courseApi from "api/Course/courseApi";

import "./ELCourse.css";

function ELCourse() {
    const [data, setData] = useState({});
    const [createDialogState, setCreateDialogState] = useState({
        state: false,
        courseId: "",
    });

    const { courseId } = useParams();

    const getData = useCallback(async (courseId) => {
        const response = await courseApi.getAnnouncement({
            courseId: parseInt(courseId),
        });
        if (response.status === 200) {
            setData(response.data);
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
                                T???o m???i b??i h???c
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                fullWidth
                                variant="contained"
                                style={{ color: "white" }}
                                startIcon={<HistoryEduIcon />}
                            >
                                T???o m???i ????? ki???m tra
                            </Button>
                        </Grid>
                    </Grid>
                </div>

                {data.result?.map((item, index) => (
                    <Announcement
                        key={index}
                        data={item}
                        getData={getData}
                        courseId={courseId}
                    />
                ))}
            </div>
            <CreateLesson
                open={createDialogState}
                setOpen={setCreateDialogState}
                getData={getData}
                courseId={courseId}
            />
        </>
    );
}
export default memo(ELCourse);
