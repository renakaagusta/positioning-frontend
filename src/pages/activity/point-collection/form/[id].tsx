import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useEffect, useState } from 'react';
import { ErrorMessage, Field, FieldArray, Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import FormLayout from 'components/Form';
import { useRouter } from 'next/router';
import Layout from 'layouts';
import { PointCollectionInterface } from 'model/pointCollection';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { LocationInterface, PointCollectionFormInterface } from '.';
import { Col, EvaIcon, Row } from '@paljs/ui';

export default function PointCollectionForm() {
  const router = useRouter();
  const { id } = router.query;
  const [pointCollection, setPointCollection] = useState<PointCollectionInterface>();
  const [initialValues, setInitialValues] = useState<PointCollectionFormInterface>({
    type: '',
    locations: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const pointCollectionFormSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    locations: Yup.array().of(
      Yup.object().shape({
        latitude: Yup.string().required('latitude is required'),
        longitude: Yup.string().required('longitude is required'),
      }),
    ),
  });

  useEffect(() => {
    if (id) {
      fetch(`https://positioning-backend.herokuapp.com/point-collections/${id}`)
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

          setPointCollection(data.pointCollection);
        });
    }
  }, [id]);

  useEffect(() => {
    if (pointCollection) {
      const locations: Array<LocationInterface> = [];

      pointCollection.data.map((data) =>
        locations.push({
          latitude: data.geometry.coordinates[1],
          longitude: data.geometry.coordinates[0],
        }),
      );

      setInitialValues({
        type: pointCollection.type,
        locations: locations,
      });
    }
  }, [pointCollection]);

  const submit = async (pointCollection: PointCollectionFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('type', pointCollection.type);

    pointCollection.locations.map((location) => {
      form.append('latitudes', location.latitude.toString());
      form.append('longitudes', location.longitude.toString());
    });

    const fetchInitOpt: RequestInit = {
      method: 'PUT',
      body: form,
    };

    fetch(`https://positioning-backend.herokuapp.com/point-collections/${id}`, fetchInitOpt)
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
      })
      .catch((error) => {
        Swal.fire({
          title: error,
          icon: 'warning',
        });
      });
  };

  return (
    <Layout title="Form Titik">
      <Formik
        initialValues={initialValues}
        validationSchema={pointCollectionFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Titik" subTitle="Formulir Titik" position="left">
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="type">Nama</label>
                <InputGroup fullWidth>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="Nama"
                    value={values.type}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.type}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <FieldArray name="locations">
                  {({ push, remove }) => (
                    <div>
                      {values.locations.map((location, index) => (
                        <Row key={index}>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={`locations.${index}.latitude`}>Latitude</label>
                              <InputGroup fullWidth>
                                <Field
                                  name={`locations.${index}.latitude`}
                                  type="number"
                                  placeholder="Latitude"
                                  value={location.latitude}
                                  onChange={handleChange}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={`locations.${index}.latitude`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                          </Col>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={`locations.${index}.longitude`}>Longitude</label>
                              <InputGroup fullWidth>
                                <Field
                                  name={`locations.${index}.longitude`}
                                  type="number"
                                  placeholder="Longitude"
                                  value={location.longitude}
                                  onChange={handleChange}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name={`locations.${index}.longitude`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                          </Col>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            {index > 0 && (
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
                            )}
                          </Col>
                        </Row>
                      ))}
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
