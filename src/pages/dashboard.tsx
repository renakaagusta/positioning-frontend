import React, { useEffect, useState } from 'react';
import Layout from 'layouts';
import { Card, CardBody } from '@paljs/ui/Card';
import { Col, Row } from '@paljs/ui';
import { ReportCategory, ReportInterface } from 'model/report';
import { getDocs, query } from 'firebase/firestore';
import { reportsCol } from 'constants/firebase';
import { UserInterface, UserRole } from 'model/user';
import ApiResponseInterface, { StatusResponse } from 'model/api';

const Home = () => {
  const [adminList, setAdminList] = useState<Array<UserInterface>>([]);
  const [hospitalList, setHospitalList] = useState<Array<UserInterface>>([]);
  const [policeList, setPoliceList] = useState<Array<UserInterface>>([]);
  const [riderList, setRiderList] = useState<Array<UserInterface>>([]);

  const [trafficJamList, setTrafficJamList] = useState<Array<ReportInterface>>([]);
  const [accidentList, setAccidentList] = useState<Array<ReportInterface>>([]);

  useEffect(() => {
    async function getReportList() {
      const q = query(reportsCol);
      const querySnapshot = await getDocs(q);
      const reportListSnapshot: Array<ReportInterface> = [];
      querySnapshot.docs.map((report) => {
        reportListSnapshot.push({
          id: report.id,
          ...report.data(),
        });
      });
      setAccidentList(reportListSnapshot.filter((report) => report.category == ReportCategory.Accident));
      setTrafficJamList(reportListSnapshot.filter((report) => report.category == ReportCategory.TrafficJam));
    }

    getReportList();
  }, []);

  useEffect(() => {
    async function getUserList() {
      fetch('https://positioning-backend.herokuapp.com/users')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          setAdminList(data.users.filter((user: UserInterface) => user.role == UserRole.Admin));
          setHospitalList(data.users.filter((user: UserInterface) => user.role == UserRole.Hospital));
          setPoliceList(data.users.filter((user: UserInterface) => user.role == UserRole.Police));
          setRiderList(data.users.filter((user: UserInterface) => user.role == UserRole.Rider));
        });
    }

    getUserList();
  }, []);

  return (
    <Layout title="Home">
      <h3>Halo, selamat datang kembali</h3>
      <h5>Ringkasan</h5>
      <Row>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Admin</h5>
              <h5>{adminList.length}</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Polisi</h5>
              <h5>{policeList.length}</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Rumah sakit</h5>
              <h5>{hospitalList.length}</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Pengendara</h5>
              <h5>{riderList.length}</h5>
            </CardBody>
          </Card>
        </Col>

        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Laporan Kecelakaan</h5>
              <h5>{accidentList.length}</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Laporan Kemacetan</h5>
              <h5>{trafficJamList.length}</h5>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
export default Home;
