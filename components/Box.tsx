import styled from "@emotion/styled";
import { maxWidth, MaxWidthProps, space, SpaceProps } from "styled-system";

// Add styled-system functions to your component
export const Box = styled.div<SpaceProps & MaxWidthProps>`
  ${maxWidth}
  ${space}
`;
