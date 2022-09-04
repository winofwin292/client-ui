import React, { Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { Login, Shop, Home } from "../pages";

function PublicRoutes() {
    return (
        <Fragment>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/shop">
                    <Shop />
                </Route>
                <Route path="">
                    <Home />
                </Route>
            </Switch>
        </Fragment>
    );
}

export default PublicRoutes;
