import "core-js/fn/array/flat-map";
import App, { Container } from "next/app";
import React from "react";
import withReduxStore from "../store/withReduxStore";
import { Provider } from "react-redux";
import Head from "next/head";
import { setAutoFreeze } from "immer";

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
