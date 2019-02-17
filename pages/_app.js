import "core-js/fn/array/flat-map";
import { setAutoFreeze } from "immer";
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { Provider } from "react-redux";
import withReduxStore from "../store/withReduxStore";

setAutoFreeze(false);

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <Container>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          />
        </Head>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default withReduxStore(MyApp);
