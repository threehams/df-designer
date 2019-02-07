import styled from "@emotion/styled";
import { space, SpaceProps } from "styled-system";

// Add styled-system functions to your component
export const Textarea = styled.textarea<SpaceProps>`
  display: block;
  width: 100%;
  ${space}
`;
