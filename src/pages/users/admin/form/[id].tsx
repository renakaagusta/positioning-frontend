import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import FormLayout from 'components/Form';
import { useRouter } from 'next/router';
import Layout from '../../../../layouts';
import { UserInterface } from 'model/user';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { AdminFormInterface } from '.';

export default function Login() {
  const router = useRouter();
  const { id } = router.query;
  const [admin, setAdmin] = useState<UserInterface>();
  const [initialValues, setInitialValues] = useState<AdminFormInterface>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const adminFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
  });

  useEffect(() => {
    if (id) {
      fetch(`https://positioning-backend.herokuapp.com/users/${id}`)
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            Swal.fire({
              title: message,
              icon: 'warning',
            });
            return;
          }

          setAdmin(data.user);
        });
    }
  }, [id]);

  useEffect(() => {
    if (admin) {
      setInitialValues({
        name: admin.name,
        username: admin.username,
        email: admin.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [admin]);

  const submit = async (adminForm: AdminFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('name', adminForm.name);
    form.append('username', adminForm.username);
    form.append('email', adminForm.email);
    form.append('password', adminForm.password);

    const fetchInitOpt: RequestInit = {
      method: 'PUT',
      body: form,
    };

    fetch(`https://positioning-backend.herokuapp.com/users/${id}`, fetchInitOpt)
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message } = result;

        if (status != StatusResponse.Success) {
          Swal.fire({
            title: message,
            icon: 'warning',
          });
          return;
        }

        Swal.fire({
          title: 'Berhasil menyimpan data',
          icon: 'success',
        });
      });
  };

  return (
    <Layout title="Form Admin">
      <Formik
        initialValues={initialValues}
        validationSchema={adminFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Admin" subTitle="Formulir Admin" position="left">
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
