import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState } from 'react';
import { Formik, FieldArray, getIn } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import FormLayout from 'components/Form';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { Col, EvaIcon, Row } from '@paljs/ui';

export interface PointCollectionFormInterface {
  type: string;
  locations: Array<{
    latitude: number;
    longitude: number;
  }>;
}

export default function PointCollectionForm() {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<PointCollectionFormInterface>({
    type: '',
    locations: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
  });

  const riderFormSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    locations: Yup.array().of(
      Yup.object().shape({
        latitude: Yup.string().required('latitude is required'),
        longitude: Yup.string().required('longitude is required'),
      }),
    ),
  });

  const submit = async (pointCollection: PointCollectionFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('type', pointCollection.type);

    pointCollection.locations.map((location) => {
      form.append('latitude', location.latitude.toString());
      form.append('longitude', location.longitude.toString());
    });

    const fetchInitOpt: RequestInit = {
      method: 'POST',
      body: form,
    };

    await fetch(`http://localhost:8000/point-collections`, fetchInitOpt)
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message } = result;

        if (status != StatusResponse.Success) {
          alert(message);
          return;
        }

        Swal.fire({
          type: 'Berhasil menyimpan data',
          icon: 'success',
        });
      });

    setLoadingSubmit(false);
  };

  return (
    <Layout title="Form Titik">
      <Formik
        initialValues={initialValues}
        validationSchema={riderFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Titik" subTitle="Formulir Titik" position="left">
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="type">Jenis</label>
                <InputGroup fullWidth>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="type"
                    value={values.type}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.type}</p>
              </div>
              <FieldArray name="people">
                {({ push, remove }) => (
                  <div>
                    {values.locations.map((location, index) => {
                      const latitude = `locations[${index}].latitude`;
                      const errorLatitude = getIn(errors, latitude);

                      const longitude = `locations[${index}].longitude`;
                      const errorLongitude = getIn(errors, longitude);
                      return (
                        <Row key={index}>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={latitude}>Latitude</label>
                              <InputGroup fullWidth>
                                <input
                                  id={latitude}
                                  name={latitude}
                                  type="number"
                                  placeholder="Latitude"
                                  value={location.latitude}
                                  onChange={handleChange}
                                />
                              </InputGroup>
                              <p style={{ color: 'red' }}>{errorLatitude}</p>
                            </div>
                          </Col>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={longitude}>Longitude</label>
                              <InputGroup fullWidth>
                                <input
                                  id={longitude}
                                  name={longitude}
                                  type="number"
                                  placeholder="Longitude"
                                  value={location.longitude}
                                  onChange={handleChange}
                                />
                              </InputGroup>
                              <p style={{ color: 'red' }}>{errorLongitude}</p>
                            </div>
                          </Col>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <Button
                              status="Danger"
                              type="button"
                              shape="SemiRound"
                              fullWidth
                              onClick={() =>
                                Swal.fire({
                                  title: 'Apakah anda yakin menghapus?',
                                  showDenyButton: true,
                                  confirmButtonText: 'Ya',
                                  denyButtonText: `Tidak`,
                                }).then((result) => {
                                  if (result.isConfirmed) {
                                    remove(index);
                                  }

                                  return;
                                })
                              }
                            >
                              <EvaIcon name="trash" />
                              Hapus
                            </Button>
                          </Col>
                        </Row>
                      );
                    })}
                    <Button
                      status="Info"
                      type="button"
                      shape="SemiRound"
                      fullWidth
                      onClick={() =>
                        push({
                          latitude: 0,
                          longitude: 0,
                        })
                      }
                    >
                      <EvaIcon name="plus" />
                      Tambah
                    </Button>
                  </div>
                )}
              </FieldArray>
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
