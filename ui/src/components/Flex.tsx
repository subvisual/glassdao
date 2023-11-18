import { ReactNode } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: ${(props: any) => props.direction || "row"};
  justify-content: ${(props: any) => props.justifyContent || "center"};
  align-items: ${(props: any) => props.alignItems || "center"};
  gap: ${(props: any) => props.gap || 0};
  margin: ${(props: any) => props.margin || 0};
  padding: ${(props: any) => props.padding || 0};
  width: ${(props: any) => props.width || "auto"};
`;

type Props = {
  children: ReactNode;
  direction?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  margin?: string;
  padding?: string;
  width?: string;
  style?: Record<string, string>;
};

function Flex({ children, ...props }: Props) {
  return <Wrapper {...props}>{children}</Wrapper>;
}

export default Flex;
