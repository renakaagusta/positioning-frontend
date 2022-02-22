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

const Admins = () => {
  const [adminList, setAdminList] = useState<Array<UserInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);

  useEffect(() => {
    async function getAdminList() {
      setLoadingStatus(true);

      const q = query(usersCol, where('role', '==', UserRole.Admin));
      const querySnapshot = await getDocs(q);
      const adminListSnapshot: Array<UserInterface> = [];
      querySnapshot.docs.map((admin) => {
        adminListSnapshot.push({
          id: admin.id,
          ...admin.data(),
        });
      });
      setAdminList(adminListSnapshot);
      setLoadingStatus(false);
    }

    getAdminList();
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
    <Layout title="Admins">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && <MUIDataTable title={'Daftar Admin'} data={adminList} columns={columns} options={options} />}
    </Layout>
  );
};

export default Admins;

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
