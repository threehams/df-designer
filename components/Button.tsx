/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import React, { MouseEventHandler } from "react";

jsx; // tslint:disable-line

interface Props {
  active?: boolean;
  block?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  color?: "primary" | "secondary";
}

const style = css`
  padding: 7px 14px;
`;

const primaryStyle = css`
  background-color: red;
  border: 2px solid red;
  color: white;
`;

const secondaryStyle = css`
  background-color: transparent;
  border: 2px solid #ccc;
`;

const secondaryActiveStyle = css`
  background-color: dodgerblue;
  border: 2px solid dodgerblue;
  color: white;
`;

export const Button: React.SFC<Props> = ({
  active,
  block,
  className,
  children,
  color = "secondary",
  ...rest
}) => {
  return (
    <button
      css={[
        style,
        color === "primary" && primaryStyle,
        color === "secondary" && [
          secondaryStyle,
          active && secondaryActiveStyle,
        ],
        css`
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
