/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { MouseEventHandler } from "react";

jsx; // tslint:disable-line

interface Props {
  active?: boolean;
  block?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Button: React.SFC<Props> = ({
  active,
  block,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      css={[
        css`
          background-color: transparent;
          border: 2px solid ${active ? "dodgerblue" : "#ccc"};
          padding: 7px 14px;
          display: ${block ? "block" : "inline-block"};
          width: ${block ? "100%" : "auto"};
        `,
        className,
      ]}
      {...rest}
    >
      {children}
    </button>
  );
};
