import { Button, Card, CardBody, Col, Row, Spinner } from '@paljs/ui';
import Layout from 'layouts';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import { reportsCol } from 'constants/firebase';
import { ReportInterface, ReportCategory } from 'model/report';

const TrafficJams = () => {
  const [TrafficJamList, setTrafficJamList] = useState<Array<ReportInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);

  useEffect(() => {
    async function getTrafficJamList() {
      setLoadingStatus(true);

      const q = query(reportsCol, where('category', '==', ReportCategory.TrafficJam));
      const querySnapshot = await getDocs(q);
      const TrafficJamListSnapshot: Array<ReportInterface> = [];
      querySnapshot.docs.map((TrafficJam) => {
        TrafficJamListSnapshot.push({
          id: TrafficJam.id,
          ...TrafficJam.data(),
        });
      });
      setTrafficJamList(TrafficJamListSnapshot);
      setLoadingStatus(false);
    }

    getTrafficJamList();
  }, []);

  const columns = [
    {
      name: 'title',
      label: 'Judul laporan',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'description',
      label: 'Deskripsi',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'action',
      label: 'Aksi',
      options: {
        customBodyRender: (value: any, tableMeta: any) => {
          return (
            <Row>
              <Col breakPoint={{ xs: 12, lg: 6 }}>
                <Button
                  status="Info"
                  type="button"
                  shape="SemiRound"
                  fullWidth
                  onClick={() => console.log(value, tableMeta)}
                >
                  Ubah
                </Button>
              </Col>
              <Col breakPoint={{ xs: 12, lg: 6 }}>
                <Button
                  status="Danger"
                  type="button"
                  shape="SemiRound"
                  fullWidth
                  onClick={() => console.log(value, tableMeta)}
                >
                  Hapus
                </Button>
              </Col>
            </Row>
          );
        },
      },
    },
  ];

  const options = {
    filterType: 'checkbox',
    customToolbar: () => (
      <>
        <CustomToolbar />
      </>
    ),
  } as Partial<any>;

  return (
    <Layout title="Kemacetan">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && (
        <MUIDataTable title={'Daftar Laporan Kemacetan'} data={TrafficJamList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default TrafficJams;

class CustomToolbar extends React.Component {
  handleClick = () => {
    console.log('clicked on icon!');
  };

  render() {
    return (
      <React.Fragment>
        <Tooltip title={'Add Data'}>
          <IconButton onClick={this.handleClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    );
  }
}
