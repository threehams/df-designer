import styled from "@emotion/styled";
import {
  alignContent,
  AlignContentProps,
  alignItems,
  AlignItemsProps,
  alignSelf,
  AlignSelfProps,
  display,
  DisplayProps,
  flex,
  flexBasis,
  FlexBasisProps,
  flexDirection,
  FlexDirectionProps,
  FlexProps,
  flexWrap,
  FlexWrapProps,
  justifyContent,
  JustifyContentProps,
  justifyItems,
  JustifyItemsProps,
  justifySelf,
  JustifySelfProps,
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
} from "styled-system";

// Add styled-system functions to your component
export const Flex = styled.div<
  AlignContentProps &
    AlignItemsProps &
    AlignSelfProps &
    DisplayProps &
    FlexProps &
    FlexBasisProps &
    FlexDirectionProps &
    FlexWrapProps &
    JustifyContentProps &
    JustifyItemsProps &
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
  ${justifyItems}
  ${justifySelf}
  ${maxWidth}
  ${space}
`;

Flex.defaultProps = {
  display: "flex",
};
