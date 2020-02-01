import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { MouseEventHandler } from "react";
import { space, SpaceProps } from "styled-system";

interface Props {
  active?: boolean;
  block?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  color?: "primary" | "secondary";
  disabled?: boolean;
}

export const Button = styled.button<Props & SpaceProps>`
  padding: 7px 14px;
  ${props =>
    props.color === "primary" &&
    css`
      background-color: ${props.theme.colors.primary};
      border: 2px solid ${props.theme.colors.primary};
      color: white;
    `}
  ${props =>
    props.color === "secondary" &&
    css`
      background-color: transparent;
      border: 2px solid #ccc;
    `}
  ${props =>
    props.color === "secondary" &&
    props.active &&
    css`
      background-color: ${props.theme.colors.secondary};
      border: 2px solid ${props.theme.colors.secondary};
      color: white;
    `}
  display: ${props => (props.block ? "block" : "inline-block")};
  width: ${props => (props.block ? "100%" : "auto")};
  ${space}
`;

Button.defaultProps = {
  color: "secondary",
};
