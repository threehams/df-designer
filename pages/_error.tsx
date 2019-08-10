import React from "react";
import { NextPage } from "next";

const ErrorPage: NextPage<{ message?: string; stack?: string }> = ({
  message,
  stack,
}) => {
  return (
    <pre>
      {message}
      {stack}
    </pre>
  );
};

ErrorPage.getInitialProps = async ({ err }) => {
  if (!err) {
    return {};
  }
  return { message: err.message, stack: err.stack };
};

export default ErrorPage;
