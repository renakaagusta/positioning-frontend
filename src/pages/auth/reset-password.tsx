import React from 'react';
import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import Link from 'next/link';

import Layout from '../../layouts';

export default function ResetPassword() {
  return (
    <Layout title="Change Password">
      <form>
        <InputGroup fullWidth>
          <input type="password" placeholder="New Password" />
        </InputGroup>
        <InputGroup fullWidth>
          <input type="password" placeholder="Confirm Password" />
        </InputGroup>
        <Button status="Success" type="button" shape="SemiRound" fullWidth>
          Change Password
        </Button>
      </form>
      <Link href="/auth/login">
        <a>Back to Log In</a>
      </Link>
      <Link href="/auth/register">
        <a>Register</a>
      </Link>
    </Layout>
  );
}
