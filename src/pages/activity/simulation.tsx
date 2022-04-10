import { Button, Card, CardBody, InputGroup, Position } from '@paljs/ui';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import * as Yup from 'yup';
import { PointCollectionInterface, PointInterface } from 'model/pointCollection';
import React, { useEffect, useState } from 'react';
import FormLayout from 'components/Form';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import { PositionInterface, ReportInterface } from 'model/report';
import MUIDataTable from 'mui-datatables';
interface SimulationFormInterface {
  startingPoint: string;
  endPoint: string;
}
interface CalculatedDataInterface {
  from: string;
  to: string;
  duration: number;
  durationInTraffic: number;
  distance: number;
  defuzzyfication: number;
}

interface MarkerInterface {
  label: string;
  lat: number;
  lng: number;
  type?: string;
}

const Simulation = () => {
  const [pointCollection, setPointCollectionList] = useState<PointCollectionInterface>();
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [markerList, setMarkerList] = useState<Array<MarkerInterface>>([]);
  const [path, setPath] = useState<Array<PositionInterface>>([]);
  const [reportId, setReportId] = useState<string>();
  const [report, setReport] = useState<ReportInterface>();
  const [calculatedDataList, setCalculatedDataList] = useState<Array<CalculatedDataInterface>>([]);
  const [totalDistance, setTotalDistance] = useState<number | null>();

  const [initialValues, setInitialValues] = useState<SimulationFormInterface>({
    startingPoint: '',
    endPoint: '',
  });

  const simulationFormSchema = Yup.object().shape({
    startingPoint: Yup.string().required('Starting point is required'),
    endPoint: Yup.string().required('End point is required'),
  });

  const columns = [
    {
      name: 'from',
      label: 'Asal',
      options: {},
    },
    {
      name: 'to',
      label: 'To',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'duration',
      label: 'Durasi',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'durationInTraffic',
      label: 'Durasi Saat Ini',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'distance',
      label: 'Jarak',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'defuzzyfication',
      label: 'Defuzzyfication',
      options: {
        filter: true,
        sort: false,
      },
    },
  ];

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

      fetch('http://localhost:8000/reports/calculated-data')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          let calculatedDataList: Array<CalculatedDataInterface> = [];

          data.calculatedData.map((calculatedData: Array<any>) => {
            calculatedDataList.push({
              from: calculatedData[0] as string,
              to: calculatedData[1] as string,
              duration: calculatedData[2] as number,
              durationInTraffic: calculatedData[3] as number,
              distance: calculatedData[4] as number,
              defuzzyfication: calculatedData[5] as number,
            });
          });

          setCalculatedDataList(calculatedDataList);
        });
      setLoadingStatus(false);
    }

    getPointCollectionList();
  }, [reloadData]);

  useEffect(() => {
    if (pointCollection != null) {
      let markerList: Array<MarkerInterface> = [];
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
    if (calculatedDataList.length != 0) {
      let distanceMarkerList: Array<MarkerInterface> = [];

      calculatedDataList.map((calculatedData: CalculatedDataInterface) => {
        const startingPoint = pointCollection?.data.find(
          (point: PointInterface) => point.properties.text == calculatedData.from,
        );
        const endPoint = pointCollection?.data.find(
          (point: PointInterface) => point.properties.text == calculatedData.to,
        );

        distanceMarkerList.push({
          label: calculatedData.distance.toFixed(4).toString(),
          lat: (startingPoint!.geometry.coordinates[1] + endPoint!.geometry.coordinates[1]) / 2,
          lng: (startingPoint!.geometry.coordinates[0] + endPoint!.geometry.coordinates[0]) / 2,
          type: 'distance',
        });
      });

      setMarkerList([...markerList, ...distanceMarkerList]);
    }
  }, [calculatedDataList]);

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
      let distanceResult = 0;

      report.routes!.map((point, index: number) => {
        const foundPoint = path.filter((pointOfPath) => pointOfPath.lat == point.lat);

        if (foundPoint.length == 0) {
          path.push({
            lat: point.lat,
            lng: point.lng,
          });
        }

        if (index != report.routes!.length - 1) {
          distanceResult += getDistance(point, report.routes![index + 1]);
        }
      });

      setPath(path);
      setTotalDistance(distanceResult);
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

  const toRad = (params: number) => {
    return (params * Math.PI) / 180;
  };

  const getDistance = (startingPoint: PositionInterface, endPoint: PositionInterface) => {
    let R = 6371;
    let x1 = endPoint.lat - startingPoint.lat;
    let dLat = toRad(x1);
    let x2 = endPoint.lng - startingPoint.lng;
    let dLon = toRad(x2);
    let c =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(startingPoint.lat)) * Math.cos(toRad(endPoint.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    let d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
    return R * d * 1000;
  };

  return (
    <Layout title="Simulation">
      <Card>
        <CardBody>
          <h1>Simulasi</h1>
          <small>Simulasi algoritma Dijkstra</small>
          <div style={{ height: '500px', maxWidth: '80vw' }}>
            <LoadScript googleMapsApiKey="AIzaSyAZx73zdc1lJUyFNnR3Wst_ucKT-QEaLhQ">
              <GoogleMap
                center={{
                  lat: -7.238922,
                  lng: 112.735021,
                }}
                mapContainerStyle={{
                  width: '80vw',
                  height: '100vh',
                }}
                zoom={17}
                onClick={(e) => console.log(e.latLng?.lat())}
              >
                {markerList.map((marker) =>
                  marker.type == 'distance' ? (
                    <Marker
                      label={marker.label}
                      position={{
                        lat: marker.lat,
                        lng: marker.lng,
                      }}
                      icon={'https://localhost:3000/empty.png'}
                    ></Marker>
                  ) : (
                    <Marker
                      label={marker.label}
                      position={{
                        lat: marker.lat,
                        lng: marker.lng,
                      }}
                    ></Marker>
                  ),
                )}
                {path && (
                  <Polyline
                    path={path}
                    options={{
                      strokeColor: '#0000FF',
                    }}
                  />
                )}
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
                    {totalDistance && <p>Total jarak: {totalDistance.toFixed(4).toString()} m</p>}
                  </FormLayout>
                );
              }}
            </Formik>
            {!isLoading && <MUIDataTable title={'Data Kalkulasi'} data={calculatedDataList} columns={columns} />}
          </div>
        </CardBody>
      </Card>
    </Layout>
  );
};

export default Simulation;
