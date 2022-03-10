import { Button } from '@paljs/ui/Button';
import { InputGroup } from '@paljs/ui/Input';
import React, { useState } from 'react';
import { Formik, FieldArray, getIn, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import FormLayout from 'components/Form';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { Col, EvaIcon, Row } from '@paljs/ui';
import { RouteInterface } from 'model/routeCollection';
export interface RouteCollectionFormInterface {
  type: string;
  routes: Array<RouteInterface>;
}

export default function RouteCollectionForm() {
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<RouteCollectionFormInterface>({
    type: '',
    routes: [
      {
        from: '',
        to: [''],
      },
    ],
  });

  const routeCollectionFormSchema = Yup.object().shape({
    type: Yup.string().required('Type is required'),
    routes: Yup.array().of(
      Yup.object().shape({
        from: Yup.string().required('from is required'),
        to: Yup.array().of(Yup.string().required('to is required')),
      }),
    ),
  });

  const submit = async (routeCollection: RouteCollectionFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('type', routeCollection.type);

    routeCollection.routes.map((location) => {
      form.append('froms', location.from.toString());
      form.append('tos', location.to.toString());
    });

    const fetchInitOpt: RequestInit = {
      method: 'POST',
      body: form,
    };

    await fetch(`http://localhost:8000/route-collections`, fetchInitOpt)
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message } = result;

        if (status != StatusResponse.Success) {
          alert(message);
          return;
        }
      });

    setLoadingSubmit(false);
  };

  return (
    <Layout title="Form Rute">
      <Formik
        initialValues={initialValues}
        validationSchema={routeCollectionFormSchema}
        onSubmit={submit}
        enableReinitialize={true}
      >
        {(formik) => {
          const { submitForm, handleChange, errors, values } = formik;
          return (
            <FormLayout title="Form Rute" subTitle="Formulir Rute" position="left">
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="type">Jenis</label>
                <InputGroup fullWidth>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    placeholder="Jenis"
                    value={values.type}
                    onChange={handleChange}
                  />
                </InputGroup>
                <p style={{ color: 'red' }}>{errors.type}</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <FieldArray name="routes">
                  {({ push, remove }) => (
                    <div>
                      {values.routes.map((location, index) => (
                        <Row key={index}>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={`routes.${index}.from`}>From</label>
                              <InputGroup fullWidth>
                                <Field
                                  name={`routes.${index}.from`}
                                  type="number"
                                  placeholder="From"
                                  value={location.from}
                                  onChange={handleChange}
                                />
                              </InputGroup>
                              <ErrorMessage name={`routes.${index}.from`} component="div" className="field-error" />
                            </div>
                          </Col>
                          <Col breakPoint={{ xs: 12, lg: 4 }}>
                            <div style={{ marginBottom: 20 }}>
                              <label htmlFor={`routes.${index}.to`}>To</label>
                              <FieldArray name={`routes.${index}.to`}>
                                {({ push, remove }) => (
                                  <div>
                                    <div style={{ marginBottom: 20 }}>
                                      {values.routes[index].to.map((destination, indexDestination) => (
                                        <div style={{ marginBottom: 20 }}>
                                          <Row key={indexDestination}>
                                            <Col breakPoint={{ xs: 12, lg: 6 }}>
                                              <InputGroup fullWidth>
                                                <Field
                                                  name={`routes.${index}.to.${indexDestination}.`}
                                                  type="number"
                                                  placeholder="To"
                                                  value={destination}
                                                  onChange={handleChange}
                                                />
                                              </InputGroup>
                                              <ErrorMessage
                                                name={`routes.${index}.to`}
                                                component="div"
                                                className="field-error"
                                              />
                                            </Col>
                                            <Col breakPoint={{ xs: 12, lg: 6 }}>
                                              {indexDestination > 0 && (
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
                                        </div>
                                      ))}
                                    </div>
                                    <Button
                                      status="Info"
                                      type="button"
                                      shape="SemiRound"
                                      fullWidth
                                      onClick={() => push('')}
                                    >
                                      <EvaIcon name="plus" />
                                      Tambah
                                    </Button>
                                  </div>
                                )}
                              </FieldArray>
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
                            from: '',
                            to: [''],
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
