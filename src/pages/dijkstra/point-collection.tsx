import { Button, Card, CardBody, Col, Row, Spinner } from '@paljs/ui';
import Layout from 'layouts';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { getDocs, query } from 'firebase/firestore';
import { pointCollectionCol } from 'constants/firebase';

interface PointDataTableInterface {
  id: string;
  type: string;
  data: number;
}

const PointCollections = () => {
  const [pointDataTable, setPointCollectionDataTable] = useState<Array<PointDataTableInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);

  useEffect(() => {
    async function getPointCollectionList() {
      setLoadingStatus(true);

      const q = query(pointCollectionCol);
      const querySnapshot = await getDocs(q);
      const pointDataTableSnapshot: Array<PointDataTableInterface> = [];
      querySnapshot.docs.map((pointCollection) => {
        pointDataTableSnapshot.push({
          id: pointCollection.id,
          type: pointCollection.data().type,
          data: pointCollection.data().data.length,
        });
      });
      setPointCollectionDataTable(pointDataTableSnapshot);
      setLoadingStatus(false);
    }

    getPointCollectionList();
  }, []);

  const columns = [
    {
      name: 'type',
      label: 'Jenis',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'data',
      label: 'Jumlah titik',
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
    <Layout title="Points">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && <MUIDataTable title={'Daftar Titik'} data={pointDataTable} columns={columns} options={options} />}
    </Layout>
  );
};

export default PointCollections;

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
