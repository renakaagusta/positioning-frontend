import { Button, Col, Row } from '@paljs/ui';
import Layout from 'Layouts';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';

const Admins = () => {
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
      name: 'createdAt',
      label: 'Terdaftar pada',
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
  const data = [
    {
      name: 'Joe James',
      email: 'Test Corp',
      createdAt: 'Yonkers',
    },
    {
      name: 'John Walsh',
      email: 'Test Corp',
      createdAt: 'Hartford',
    },
    {
      name: 'Bob Herm',
      email: 'Test Corp',
      createdAt: 'Tampa',
    },
    {
      name: 'James Houston',
      email: 'Test Corp',
      createdAt: 'Dallas',
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
      <MUIDataTable title={'Daftar Admin'} data={data} columns={columns} options={options} />
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
