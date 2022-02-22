import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React from 'react';
import Link from 'next/link';

import Auth from 'components/Auth';
import Layout from 'Layouts';

export default function Login() {
  return (
    <Layout title="Login">
      <Auth title="Login" subTitle="Positioning">
        <form>
          <InputGroup fullWidth>
            <input type="email" placeholder="Email Address" />
          </InputGroup>
          <InputGroup fullWidth>
            <input type="password" placeholder="Password" />
          </InputGroup>
          <Button status="Success" type="button" shape="SemiRound" fullWidth>
            Login
          </Button>
        </form>
        <br />
        <p>
          Tidak memiliki akun?{' '}
          <Link href="/auth/register">
            <a>Daftar</a>
          </Link>
        </p>
      </Auth>
    </Layout>
  );
}
