import { Button, Card, CardBody, Col, EvaIcon, Row, Spinner } from '@paljs/ui';
import MUIDataTable from 'mui-datatables';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { PointCollectionInterface } from 'model/pointCollection';
interface PointCollectionDataTableInterface {
  id: string;
  type: string;
  data: number;
}

const PointCollections = () => {
  const [pointCollectionList, setPointCollectionList] = useState<Array<PointCollectionDataTableInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);

  useEffect(() => {
    async function getPointCollectionList() {
      setLoadingStatus(true);

      fetch('http://localhost:8000/point-collections')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          const pointCollectionDataTable: Array<PointCollectionDataTableInterface> = [];

          data.pointCollections.map((pointCollection: PointCollectionInterface) => {
            pointCollectionDataTable.push({
              id: pointCollection.id!,
              type: pointCollection.type!,
              data: pointCollection.data.length,
            });
          });

          setPointCollectionList(pointCollectionDataTable);
        });
      setLoadingStatus(false);
    }

    console.log('point');
    console.log(pointCollectionList);

    getPointCollectionList();
  }, [reloadData]);

  const deletePointCollection = async (pointCollectionId: string) => {
    fetch(`http://localhost:8000/point-collections/${pointCollectionId}`, {
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
                <Link href={`point-collection/form/${pointCollectionList[tableMeta.rowIndex].id}`}>
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
                        deletePointCollection(pointCollectionList[tableMeta.rowIndex].id!);
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
    <Layout title="PointCollections">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && (
        <MUIDataTable title={'Daftar Pengendara'} data={pointCollectionList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default PointCollections;

class CustomToolbar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip title={'Add Data'}>
          <Link href={'point-collection/form/'}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </React.Fragment>
    );
  }
}
