import { HooksProvider } from "@epeli/redux-hooks";
import "core-js/fn/array/flat-map";
import { setAutoFreeze } from "immer";
import withRedux from "next-redux-wrapper";
import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { configureStore } from "../store/configureStore";

setAutoFreeze(false);

class MyApp extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Container>
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Open+Sans"
            rel="stylesheet"
          />
        </Head>
        <HooksProvider store={store}>
          <Component {...pageProps} store={store} />
        </HooksProvider>
      </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
