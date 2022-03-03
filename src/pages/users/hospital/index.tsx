import { Button, Card, CardBody, Col, EvaIcon, Row, Spinner } from '@paljs/ui';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Layout from 'layouts';
import { UserInterface, UserRole } from 'model/user';
import ApiResponseInterface, { StatusResponse } from 'model/api';

const Hospitals = () => {
  const [hospitalList, setHospitalList] = useState<Array<UserInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);

  useEffect(() => {
    async function getHospitalList() {
      setLoadingStatus(true);

      fetch('http://localhost:8000/users')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          setHospitalList(data.users.filter((user: UserInterface) => user.role == UserRole.Hospital));
        });
      setLoadingStatus(false);
    }

    getHospitalList();
  }, [reloadData]);

  const deleteHospital = async (hospitalId: string) => {
    fetch(`http://localhost:8000/users/${hospitalId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((result: ApiResponseInterface) => {
        const { status, message } = result;

        if (status != StatusResponse.Success) {
          Swal.fire({
            title: message,
            icon: 'warning',
          });
          return;
        }

        Swal.fire({
          title: 'Berhasil menghapus',
          icon: 'success',
        });

        setReloadData(reloadData + 1);
      });
  };

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
                <Link href={`hospital/form/${hospitalList[tableMeta.rowIndex].id}`}>
                  <Button status="Info" type="button" shape="SemiRound" fullWidth>
                    <EvaIcon name="edit" />
                    Ubah
                  </Button>
                </Link>
              </Col>
              <Col breakPoint={{ xs: 12, lg: 6 }}>
                <Button
                  status="Danger"
                  type="button"
                  shape="SemiRound"
                  fullWidth
                  onClick={() =>
                    Swal.fire({
                      title: 'Apakah anda yakin menghapus?',
                      showDenyButton: true,
                      confirmButtonText: 'Ya',
                      denyButtonText: `Tidak`,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        deleteHospital(hospitalList[tableMeta.rowIndex].id!);
                      }

                      return;
                    })
                  }
                >
                  <EvaIcon name="trash" />
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
        <MUIDataTable title={'Daftar Rumah Sakit'} data={hospitalList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default Hospitals;

class CustomToolbar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip title={'Add Data'}>
          <Link href={'hospital/form/'}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </React.Fragment>
    );
  }
}
