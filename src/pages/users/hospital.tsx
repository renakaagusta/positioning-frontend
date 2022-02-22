import { Button, Card, CardBody, Col, Row, Spinner } from '@paljs/ui';
import Layout from 'layouts';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import { usersCol } from 'constants/firebase';
import { UserInterface, UserRole } from 'model/user';

const Hospitals = () => {
  const [hospitalList, setHospitalList] = useState<Array<UserInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);

  useEffect(() => {
    async function getHospitalList() {
      setLoadingStatus(true);

      const q = query(usersCol, where('role', '==', UserRole.Hospital));
      const querySnapshot = await getDocs(q);
      const hospitalListSnapshot: Array<UserInterface> = [];
      querySnapshot.docs.map((hospital) => {
        hospitalListSnapshot.push({
          id: hospital.id,
          ...hospital.data(),
        });
      });
      setHospitalList(hospitalListSnapshot);
      setLoadingStatus(false);
    }

    getHospitalList();
  }, []);

  const columns = [
    {
      name: 'name',
      label: 'Nama',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'email',
      label: 'Email',
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
    <Layout title="Hospitals">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && (
        <MUIDataTable title={'Daftar Kantor Polisi'} data={hospitalList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default Hospitals;

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
