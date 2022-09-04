import React, { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

function Login() {
    let [selected, setSelected] = useState([]);
    let navigate = useNavigate();

    function handleChange(e) {
        const { options } = e.target;
        let selected = [];

        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelected(selected);
    }

    function handleClick() {
        localStorage.setItem("roles", JSON.stringify(selected));
        navigate("/app");
        // window.location.href = "/app";
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log In
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
                    <InputLabel shrink htmlFor="select-multiple-native">
                        Select role:
                    </InputLabel>
                    <Select
                        multiple
                        native
                        value={selected}
                        // @ts-ignore Typings are not considering `native`
                        onChange={handleChange}
                        label="Select role:"
                        inputProps={{
                            id: "select-multiple-native",
                        }}
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="TEACHER">TEACHER</option>
                        <option value="STUDENT">STUDENT</option>
                        <option value="GUEST">GUEST</option>
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={handleClick}
                    disabled={!selected.length}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
}

export default memo(Login);
