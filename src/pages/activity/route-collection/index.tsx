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
import { RouteCollectionInterface } from 'model/routeCollection';
interface RouteCollectionDataTableInterface {
  id: string;
  type: string;
  data: number;
}

const RouteCollections = () => {
  const [routeCollectionList, setRouteCollectionList] = useState<Array<RouteCollectionDataTableInterface>>([]);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [reloadData, setReloadData] = useState<number>(0);

  useEffect(() => {
    async function getRouteCollectionList() {
      setLoadingStatus(true);

      fetch('https://positioning-backend.herokuapp.com/route-collections')
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            alert(message);
          }

          const routeCollectionDataTable: Array<RouteCollectionDataTableInterface> = [];

          data.routeCollections.map((routeCollection: RouteCollectionInterface) => {
            routeCollectionDataTable.push({
              id: routeCollection.id!,
              type: routeCollection.type!,
              data: routeCollection.routes.length,
            });
          });

          setRouteCollectionList(routeCollectionDataTable);
        });
      setLoadingStatus(false);
    }

    getRouteCollectionList();
  }, [reloadData]);

  const deleteRouteCollection = async (routeCollectionId: string) => {
    fetch(`https://positioning-backend.herokuapp.com/route-collections/${routeCollectionId}`, {
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
      label: 'Jumlah rute',
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
                <Link href={`route-collection/form/${routeCollectionList[tableMeta.rowIndex].id}`}>
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
                        deleteRouteCollection(routeCollectionList[tableMeta.rowIndex].id!);
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
    <Layout title="RouteCollections">
      {isLoading && (
        <Col breakPoint={{ xs: 12 }}>
          <Card style={{ position: 'relative' }}>
            <CardBody>Some card content.</CardBody>
            <Spinner size="Large">Loading...</Spinner>
          </Card>
        </Col>
      )}
      {!isLoading && (
        <MUIDataTable title={'Daftar Pengendara'} data={routeCollectionList} columns={columns} options={options} />
      )}
    </Layout>
  );
};

export default RouteCollections;

class CustomToolbar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Tooltip title={'Add Data'}>
          <Link href={'route-collection/form/'}>
            <IconButton>
              <AddIcon />
            </IconButton>
          </Link>
        </Tooltip>
      </React.Fragment>
    );
  }
}
