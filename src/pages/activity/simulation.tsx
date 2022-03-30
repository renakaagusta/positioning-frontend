import { Button, Card, CardBody, InputGroup, Position } from '@paljs/ui';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import * as Yup from 'yup';
import { PointCollectionInterface, PointInterface } from 'model/pointCollection';
import { ErrorStyle } from 'pages/404';
import React, { useEffect, useState } from 'react';
import FormLayout from 'components/Form';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { PositionInterface, ReportInterface } from 'model/report';
interface SimulationFormInterface {
  startingPoint: string;
  endPoint: string;
}

const Simulation = () => {
  const [pointCollection, setPointCollectionList] = useState<PointCollectionInterface>();
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [markerList, setMarkerList] = useState<Array<PositionInterface>>([]);
  const [path, setPath] = useState<Array<PositionInterface>>([]);
  const [reportId, setReportId] = useState<String>();
  const [report, setReport] = useState<ReportInterface>();

  const [initialValues, setInitialValues] = useState<SimulationFormInterface>({
    startingPoint: '',
    endPoint: '',
  });

  const simulationFormSchema = Yup.object().shape({
    startingPoint: Yup.string().required('Starting point is required'),
    endPoint: Yup.string().required('End point is required'),
  });

  useEffect(() => {
    async function getPointCollectionList() {
      setLoadingStatus(true);

      fetch('http://localhost:8000/point-collections')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          setPointCollectionList(data.pointCollections[0]);
        });
      setLoadingStatus(false);
    }

    getPointCollectionList();
  }, [reloadData]);

  useEffect(() => {
    if (pointCollection != null) {
      let markerList: Array<PositionInterface> = [];
      pointCollection.data.map((point) =>
        markerList.push({
          label: point.properties.text,
          lat: point.geometry.coordinates[1],
          lng: point.geometry.coordinates[0],
        }),
      );
      setMarkerList(markerList);
    }
  }, [pointCollection]);

  useEffect(() => {
    if (reportId) {
      setLoadingStatus(true);

      fetch(`http://localhost:8000/reports/${reportId}`)
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

          setReport(data.report);

          setLoadingStatus(false);
        });
    }
  }, [reportId]);

  useEffect(() => {
    if (report) {
      let path: Array<PositionInterface> = [];

      report.routes!.map((point) => {
        const foundPoint = path.filter((pointOfPath) => pointOfPath.lat == point.lat);

        if (foundPoint.length == 0) {
          path.push({
            lat: point.lat,
            lng: point.lng,
          });
        }
      });

      setPath(path);
    }
  }, [report]);

  const submit = async (simulationForm: SimulationFormInterface) => {
    setLoadingSubmit(true);

    const form = new URLSearchParams();

    form.append('startingPoint', simulationForm.startingPoint);
    form.append('endPoint', simulationForm.endPoint);
    form.append('title', 'simulation');
    form.append('description', 'simulation');
    form.append('category', 'simulation');
    form.append('rider', 'simulation');
    form.append('createdAt', new Date().toISOString());
    form.append('type', 'simulation');

    const fetchInitOpt: RequestInit = {
      method: 'POST',
      body: form,
    };

    fetch(`http://localhost:8000/reports`, fetchInitOpt)
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message, data } = result;

        if (status != StatusResponse.Success) {
          Swal.fire({
            title: message,
            icon: 'warning',
          });
          return;
        }

        setReportId(data.reportId);

        setLoadingStatus(false);
      });
  };

  return (
    <Layout title="Simulation">
      <Card>
        <CardBody>
          <ErrorStyle>
            <h1>Simulasi</h1>
            <small>Simulasi algoritma Dijkstra</small>
            <div style={{ height: '500px', width: '100vw' }}>
              <LoadScript googleMapsApiKey="AIzaSyAZx73zdc1lJUyFNnR3Wst_ucKT-QEaLhQ">
                <GoogleMap
                  center={{
                    lat: -7.238922,
                    lng: 112.735021,
                  }}
                  mapContainerStyle={{
                    width: '100vw',
                    height: '100vh',
                  }}
                  zoom={17}
                  onClick={(e) => console.log(e.latLng?.lat())}
                >
                  {markerList.map((marker) => (
                    <Marker
                      label={marker.label}
                      position={{
                        lat: marker.lat,
                        lng: marker.lng,
                      }}
                    ></Marker>
                  ))}
                  {path && <Polyline path={path} />}
                </GoogleMap>
              </LoadScript>
              <Formik
                initialValues={initialValues}
                validationSchema={simulationFormSchema}
                onSubmit={submit}
                enableReinitialize={true}
              >
                {(formik) => {
                  const { submitForm, handleChange, errors, values } = formik;
                  return (
                    <FormLayout title="Masukan titik" position="left">
                      <div style={{ marginBottom: 20 }}>
                        <label htmlFor="startingPoint">Titik Awal</label>
                        <InputGroup fullWidth>
                          <input
                            id="startingPoint"
                            name="startingPoint"
                            type="text"
                            placeholder="Titik awal"
                            value={values.startingPoint}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        <p style={{ color: 'red' }}>{errors.startingPoint}</p>
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label htmlFor="endPoint">Titik akhir</label>
                        <InputGroup fullWidth>
                          <input
                            id="endPoint"
                            name="endPoint"
                            type="text"
                            placeholder="Titik akhir"
                            value={values.endPoint}
                            onChange={handleChange}
                          />
                        </InputGroup>
                        <p style={{ color: 'red' }}>{errors.endPoint}</p>
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
            </div>
          </ErrorStyle>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Simulation;
