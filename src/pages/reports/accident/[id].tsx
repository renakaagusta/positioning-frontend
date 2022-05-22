import { Card, CardBody } from '@paljs/ui';
import { GoogleMap, LoadScript, Polyline } from '@react-google-maps/api';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { PositionInterface, ReportCategory, ReportInterface, ReportStatus, ReportType } from 'model/report';
import { UserInterface } from 'model/user';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Accident() {
  const router = useRouter();
  const { id } = router.query;
  const [path, setPath] = useState<Array<PositionInterface>>([]);
  const [userList, setUserList] = useState<Array<UserInterface>>([]);
  const [rider, setRider] = useState<UserInterface>();
  const [hospital, setHospital] = useState<UserInterface>();
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);
  const [report, setReport] = useState<ReportInterface>({
    id: '',
    rider: '',
    handler: '',
    handlerLocation: {
      latitude: 0,
      longitude: 0,
    },
    title: '',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    category: ReportCategory.TrafficJam,
    status: ReportStatus.Created,
    routes: [],
    type: ReportType.Real,
    rejectedBy: [],
    createdAt: new Date(),
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetch(`https://positioning-backend.herokuapp.com/reports/${id}`)
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
        });
    }
  }, [id]);

  useEffect(() => {
    async function getHospitalList() {
      setLoadingStatus(true);

      fetch('https://positioning-backend.herokuapp.com/users')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          setUserList(data.users);
        });
      setLoadingStatus(false);
    }

    getHospitalList();
  }, [reloadData]);

  useEffect(() => {
    if (report && userList.length > 0) {
      setRider(userList.find((user) => user.id == report.rider));
      setHospital(userList.find((user) => user.id == report.handler));
      let path: Array<PositionInterface> = [];
      if (report.routes) {
        report.routes.map((point, index) => {
          if (report!.routes!.length != index) {
            path.push({
              lat: point.lat,
              lng: point.lng,
            });
          }
        });
      }
      setPath(path);
    }
  }, [report, userList]);

  return (
    <Layout title="Detail Laporan Kemacetan">
      <Card>
        <CardBody>
          <h1>Laporan Kemcatean</h1>
          <small>Detail laporan Kemacetan</small>
          <div style={{ height: '500px', maxWidth: '80vw', marginTop: 50 }}>
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
          </div>
          <div>
            <div style={{ height: 120, marginTop: 60 }} />
            <p style={{ fontWeight: 'bold' }}>Pengendara</p>
            <p>{rider?.username}</p>
            <p style={{ fontWeight: 'bold' }}>Rumah sakit</p>
            <p>{hospital?.name}</p>
            <p style={{ fontWeight: 'bold' }}>Status laporan</p>
            <p>
              {report.status == ReportStatus.Created
                ? 'Dibuat'
                : report.status == ReportStatus.Confirmed
                ? 'Dikonfirmasi'
                : 'Ditolak'}
            </p>
          </div>
        </CardBody>
      </Card>
    </Layout>
  );
}
