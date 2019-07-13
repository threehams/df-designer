import styled from "@emotion/styled";
import {
  display,
  DisplayProps,
  gridTemplateAreas,
  GridTemplateAreasProps,
  height,
  HeightProps,
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
} from "styled-system";

export const Grid = styled.div<
  DisplayProps &
    MaxWidthProps &
    SpaceProps &
    HeightProps &
    GridTemplateAreasProps
>`
  ${gridTemplateAreas}
  ${display}
  ${height}
  ${maxWidth}
  ${space}
`;

Grid.defaultProps = {
  display: "grid",
};
