/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { MouseEventHandler } from "react";

jsx; // tslint:disable-line

interface Props {
  active?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export const Button: React.SFC<Props> = ({
  active,
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
        `,
        className,
      ]}
      {...rest}
    >
      {children}
    </button>
  );
};
