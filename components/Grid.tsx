import styled from "@emotion/styled";
import {
  display,
  DisplayProps,
  gridTemplateAreas,
  GridTemplatesAreasProps,
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
    GridTemplatesAreasProps
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
