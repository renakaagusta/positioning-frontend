import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import { Checkbox } from '@paljs/ui/Checkbox';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import Layout from '../../layouts';

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

export default function Register() {
  return (
    <Layout title="Register">
        <form>
          <Input fullWidth>
            <input type="text" placeholder="Username" />
          </Input>
          <Input fullWidth>
            <input type="email" placeholder="Email Address" />
          </Input>
          <Input fullWidth>
            <input type="password" placeholder="Password" />
          </Input>
          <Input fullWidth>
            <input type="password" placeholder="Confirm Password" />
          </Input>
          <Button status="Success" type="button" shape="SemiRound" fullWidth>
            Registrasi
          </Button>
        </form>
        <p>
          Sudah memiliki akun?{' '}
          <Link href="/auth/login">
            <a>Log In</a>
          </Link>
        </p>
    </Layout>
  );
}
