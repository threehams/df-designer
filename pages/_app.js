import "core-js/stable";
import { setAutoFreeze } from "immer";
import withRedux from "next-redux-wrapper";
import App from "next/app";
import Head from "next/head";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "../store/configureStore";

setAutoFreeze(false);

class MyApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          />
        </Head>
        <Provider store={store}>
          <Component {...pageProps} store={store} />
        </Provider>
      </>
    );
  }
}

export default withRedux(configureStore)(MyApp);
