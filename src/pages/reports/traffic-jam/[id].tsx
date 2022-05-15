import Layout from 'layouts';
import ApiResponseInterface, { StatusResponse } from 'model/api';
import { ReportCategory, ReportInterface, ReportStatus, ReportType } from 'model/report';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function TrafficJam() {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<ReportInterface>({
    id: '',
    rider: '',
    handler: '',
    handlerLocation: {
      latitude: 0,
      longitude: 0,
    },
    title: '',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    category: ReportCategory.TrafficJam,
    status: ReportStatus.Created,
    routes: [],
    type: ReportType.Real,
    rejectedBy: [],
    createdAt: new Date(),
  });
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/reports/${id}`)
        .then((response) => response.json())
        .then((result: ApiResponseInterface) => {
          const { status, data, message } = result;

          if (status != StatusResponse.Success) {
            Swal.fire({
              title: message,
              icon: 'warning',
            });
            return;
          }

          setReport(data.report);
        });
    }
  }, [id]);

  return <Layout title="Detail Laporan Kemacetan"></Layout>;
}
