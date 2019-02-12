import styled from "@emotion/styled";
import {
  alignContent,
  AlignContentProps,
  alignItems,
  AlignItemsProps,
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
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
} from "styled-system";

export const Flex = styled.div<
  AlignContentProps &
    AlignItemsProps &
    DisplayProps &
    FlexProps &
    FlexBasisProps &
    FlexDirectionProps &
    FlexWrapProps &
    JustifyContentProps &
    MaxWidthProps &
    SpaceProps
>`
  ${alignContent}
  ${alignItems}
  ${display}
  ${flex}
  ${flexBasis}
  ${flexDirection}
  ${flexWrap}
  ${justifyContent}
  ${maxWidth}
  ${space}
`;

Flex.defaultProps = {
  display: "flex",
};
