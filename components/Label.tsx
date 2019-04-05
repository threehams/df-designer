import styled from "@emotion/styled";
import { alignContent, AlignContentProps, alignItems, AlignItemsProps, alignSelf, AlignSelfProps, display, DisplayProps, flex, flexBasis, FlexBasisProps, flexDirection, FlexDirectionProps, FlexProps, flexWrap, FlexWrapProps, justifyContent, JustifyContentProps, justifySelf, JustifySelfProps, maxWidth, MaxWidthProps, space, SpaceProps } from "styled-system";

export const Label = styled.label<
  AlignContentProps &
    AlignItemsProps &
    AlignSelfProps &
    DisplayProps &
    FlexProps &
    FlexBasisProps &
    FlexDirectionProps &
    FlexWrapProps &
    JustifyContentProps &
    JustifySelfProps &
    MaxWidthProps &
    SpaceProps
>`
  ${alignContent}
  ${alignItems}
  ${alignSelf}
  ${display}
  ${flex}
  ${flexBasis}
  ${flexDirection}
  ${flexWrap}
  ${justifyContent}
  ${justifySelf}
  ${maxWidth}
  ${space}
`;
