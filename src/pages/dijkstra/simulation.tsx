import { Button, ButtonLink, Card, CardBody, Col, Row, Spinner } from '@paljs/ui';
import Layout from 'layouts';
import React from 'react';
import { ErrorStyle } from 'pages/404';
import router from 'next/router';

const Simulation = () => (
  <Layout title="Simulation">
    <Card>
      <CardBody>
        <ErrorStyle>
          <h1>Simulasi</h1>
          <small>Simulasi algoritma Dijkstra</small>
          <ButtonLink fullWidth appearance="hero" onClick={() => router.push('/')} shape="Rectangle">
            Mulai
          </ButtonLink>
        </ErrorStyle>
      </CardBody>
    </Card>
  </Layout>
);

export default Simulation;
