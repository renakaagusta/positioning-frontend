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
import { PoliceFormInterface } from '.';

export default function Login() {
  const router = useRouter();
  const { id } = router.query;
  const [police, setPolice] = useState<UserInterface>();
  const [initialValues, setInitialValues] = useState<PoliceFormInterface>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    latitude: 0,
    longitude: 0,
    phoneNumber: '',
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const policeFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required').min(8, 'Password is too short - should be 8 chars minimum'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match'),
    latitude: Yup.string().required('Latitude is required'),
    longitude: Yup.string().required('Email is required'),
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

          setPolice(data.user);
        });
    }
  }, [id]);

  useEffect(() => {
    if (police) {
      setInitialValues({
        name: police.name,
        username: police.username,
        email: police.email,
        password: '',
        confirmPassword: '',
        latitude: police.meta?.location.static.latitude ?? 0,
        longitude: police.meta?.location.static.longitude ?? 0,
        phoneNumber: police.meta?.phoneNumber,
      });
    }
  }, [police]);

  const submit = async (policeForm: PoliceFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('name', policeForm.name);
    form.append('username', policeForm.username);
    form.append('email', policeForm.email);
    form.append('password', policeForm.password);
    form.append('latitude', policeForm.latitude.toString());
    form.append('longitude', policeForm.longitude.toString());
    form.append('phoneNumber', policeForm.phoneNumber ?? '');

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
    <Layout title="Form Kantor Polisi">
      <Formik
        initialValues={initialValues}
        validationSchema={policeFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Kantor Polisi" subTitle="Formulir Kantor Polisi" position="left">
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
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="latitude">Latitude</label>
                <InputGroup fullWidth>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    placeholder="Latitude"
                    value={values.latitude}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.latitude}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="latitude">Longitude</label>
                <InputGroup fullWidth>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    placeholder="Longitude"
                    value={values.longitude}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.longitude}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="phoneNumber">Nomor HP</label>
                <InputGroup fullWidth>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="number"
                    placeholder="Nomor HP"
                    value={values.phoneNumber}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.phoneNumber}</p>
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
