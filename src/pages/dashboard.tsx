import React from 'react';
import Layout from 'Layouts';
import { Card, CardBody } from '@paljs/ui/Card';
import { Col, Row } from '@paljs/ui';

const Home = () => {
  return (
    <Layout title="Home">
      <h3>Halo, selamat datang kembali</h3>
      <h5>Ringkasan</h5>
      <Row>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Admin</h5>
              <h5>2</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Polisi</h5>
              <h5>2</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Rumah sakit</h5>
              <h5>2</h5>
            </CardBody>
          </Card>
        </Col>
        <Col breakPoint={{ xs: 6, lg: 3 }}>
          <Card>
            <CardBody>
              <h5>Pengendara</h5>
              <h5>2</h5>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
export default Home;
