import styled from 'styled-components';
import { Card, CardBody } from '@paljs/ui/Card';
import { breakpointDown } from '@paljs/ui/breakpoints';
import React from 'react';

const FormStyle = styled.div<{ subTitle?: string; position?: string }>`
  margin: auto;
  display: block;
  width: 100%;
  max-width: 60rem;
  a {
    font-weight: 600;
  }
  & > h1 {
    margin-bottom: ${({ subTitle }) => (subTitle ? '0.75' : '2')}rem;
    margin-top: 0;
    text-align: ${({ position }) => position};
  }
  & > p {
    margin-bottom: 2rem;
    text-align: ${({ position }) => position};
  }
  form {
    width: 100%;
    & > *:not(:last-child) {
      margin-bottom: 2rem;
    }
  }
`;
export const Group = styled.div`
  margin: 2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardForm = styled(Card)`
  margin-bottom: 0;
  height: calc(100vh - 5rem);
  ${breakpointDown('sm')`
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;
interface FormProps {
  title: string;
  subTitle?: string;
  position?: string;
}
const Form: React.FC<FormProps> = ({ subTitle, title, position, children }) => {
  return (
    <CardForm>
      <CardBody>
        <FormStyle subTitle={subTitle} position={position}>
          <h1>{title}</h1>
          {subTitle && <p>{subTitle}</p>}
          {children}
        </FormStyle>
      </CardBody>
    </CardForm>
  );
};
export default Form;
