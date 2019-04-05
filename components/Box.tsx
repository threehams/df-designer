import styled from "@emotion/styled";
import { alignSelf, AlignSelfProps, background, BackgroundProps, display, DisplayProps, gridArea, GridAreaProps, height, HeightProps, justifySelf, JustifySelfProps, maxWidth, MaxWidthProps, overflow, OverflowProps, space, SpaceProps, width, WidthProps } from "styled-system";

export const Box = styled.div<
  BackgroundProps &
    DisplayProps &
    SpaceProps &
    MaxWidthProps &
    AlignSelfProps &
    JustifySelfProps &
    GridAreaProps &
    HeightProps &
    OverflowProps &
    WidthProps
>`
  ${alignSelf}
  ${background}
  ${display}
  ${gridArea}
  ${height}
  ${justifySelf}
  ${maxWidth}
  ${overflow}
  ${space}
  ${width}
`;
