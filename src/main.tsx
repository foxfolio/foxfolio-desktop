import React from "react";
import { render } from "react-dom";
import { configureSentry } from "./helpers/sentry";
import Root from "./pages/Root";
import { configureStore, history } from "./store/configureStore";

import "./app.global.css";

configureSentry();

const { persistor, store } = configureStore();

render(
  <Root store={store} history={history} persistor={persistor} />,
  document.getElementById("root")
);

postMessage({ payload: "removeLoading" }, "*");
