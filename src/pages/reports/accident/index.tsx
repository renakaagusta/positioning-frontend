import { Button, Card, CardBody, Col, EvaIcon, Row, Spinner } from '@paljs/ui';
import Layout from 'layouts';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { getDocs, query, where } from 'firebase/firestore';
import { reportsCol } from 'constants/firebase';
import { ReportInterface, ReportCategory } from 'model/report';
import Link from 'next/link';
import Swal from 'sweetalert2';
import ApiResponseInterface, { StatusResponse } from 'model/api';

const Accidents = () => {
  const [accidentList, setAccidentList] = useState<Array<ReportInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);

  const deleteReport = async (reportId: string) => {
    fetch(`https://positioning-backend.herokuapp.com/reports/${reportId}`, {
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

  useEffect(() => {
    async function getAccidentList() {
      setLoadingStatus(true);

      const q = query(reportsCol, where('category', '==', ReportCategory.Accident));
      const querySnapshot = await getDocs(q);
      const AccidentListSnapshot: Array<ReportInterface> = [];
      querySnapshot.docs.map((Accident) => {
        AccidentListSnapshot.push({
          id: Accident.id,
          ...Accident.data(),
        });
      });
      setAccidentList(AccidentListSnapshot);
      setLoadingStatus(false);
    }

    getAccidentList();
  }, [reloadData]);

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
                <Link href={`accident/${accidentList[tableMeta.rowIndex].id}`}>
                  <Button status="Info" type="button" shape="SemiRound" fullWidth>
                    Lihat
                  </Button>
                </Link>
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
                        deleteReport(accidentList[tableMeta.rowIndex].id!);
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
    customToolbar: () => (
      <>
        <CustomToolbar />
      </>
    ),
  } as Partial<any>;

  return (
    <Layout title="Kecelakaan">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && (
        <MUIDataTable title={'Daftar Laporan Kecelakaan'} data={accidentList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default Accidents;

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
