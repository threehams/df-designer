/** @jsx jsx */
import { css, jsx } from "@emotion/core";

jsx; // tslint:disable-line

const blockStyles = css`
  & > * + * {
    margin-top: 5px;
  }
  & + * {
    margin-top: 20px;
  }
`;
const inlineStyles = css`
  & > * + * {
    margin-left: 5px;
  }
  & + * {
    margin-left: 20px;
  }
`;

interface ButtonGroupProps {
  block?: boolean;
  className?: string;
}
export const ButtonGroup: React.FunctionComponent<ButtonGroupProps> = ({
  block,
  children,
  className,
}) => {
  return (
    <div className={className} css={block ? blockStyles : inlineStyles}>
      {children}
    </div>
  );
};
