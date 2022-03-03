import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import FormLayout from 'components/Form';
import Layout from 'layouts';
import { UserRole } from 'model/user';
import ApiResponseInterface, { StatusResponse } from 'model/api';
export interface RiderFormInterface {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RiderForm() {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const riderFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
  });

  const submit = async (riderForm: RiderFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('name', riderForm.name);
    form.append('username', riderForm.username);
    form.append('email', riderForm.email);
    form.append('password', riderForm.password);
    form.append('role', UserRole.Rider);

    const fetchInitOpt: RequestInit = {
      method: 'POST',
      body: form,
    };

    await fetch(`http://localhost:8000/users`, fetchInitOpt)
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message } = result;

        if (status != StatusResponse.Success) {
          alert(message);
          return;
        }

        Swal.fire({
          title: 'Berhasil menyimpan data',
          icon: 'success',
        });
      });

    setLoadingSubmit(false);
  };

  return (
    <Layout title="Form Rider">
      <Formik
        initialValues={{
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          latitude: 0,
          longitude: 0,
        }}
        validationSchema={riderFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Rider" subTitle="Formulir Rider" position="left">
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="name">Nama</label>
                <InputGroup fullWidth>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.name}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="username">Username</label>
                <InputGroup fullWidth>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username"
                    value={values.username}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.username}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="email">Email</label>
                <InputGroup fullWidth>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={values.email}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.email}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="password">Password</label>
                <InputGroup fullWidth>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.password}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="password">Konfirmasi Password</label>
                <InputGroup fullWidth>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.confirmPassword}</p>
              </div>
              <Button
                status="Success"
                type="submit"
                shape="SemiRound"
                fullWidth
                disabled={loadingSubmit}
                onClick={submitForm}
              >
                Submit
              </Button>
            </FormLayout>
          );
        }}
      </Formik>
    </Layout>
  );
}
