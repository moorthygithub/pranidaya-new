import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../layout/Layout";
import RequestFilter from "../../../components/RequestFilter";
import { ContextPanel } from "../../../utils/ContextPanel";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../base/BaseUrl";
import { MdEdit, MdOutlineRemoveRedEye } from "react-icons/md";
import MUIDataTable from "mui-datatables";
import moment from "moment";
import { Spinner } from "@material-tailwind/react";
const RecepitCashRecepit = () => {
  const [pendingRListData, setPendingRListData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchPendingRData = async () => {
      const userTypeId = localStorage.getItem("user_type_id");
      if (!userTypeId) {
        navigate("/signin");
        return;
      }

      setUserType(userTypeId);

      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseUrl}/fetch-c-receipt-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = response.data?.receipts;
        console.log(res);
        if (Array.isArray(res)) {
          const tempRows = res.map((item, index) => [
            index + 1,
            item["c_receipt_no"],
            item["donor_full_name"],
            moment(item["c_receipt_date"]).format("DD-MM-YYYY"),
            item["c_receipt_exemption_type"],
            item["c_receipt_total_amount"],
            item["c_receipt_count"],
            item["id"],
          ]);
          setPendingRListData(tempRows);
        }
      } catch (error) {
        console.error("Error fetching pending list request data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRData();
  }, [isPanelUp, navigate]);

  const columns = [
    {
      name: "SlNo",
      label: "SlNo",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "Receipt No",
      label: "Receipt No",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Name",
      label: "Name",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Date",
      label: "Date",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Exemption Type",
      label: "Exemption Type",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Donation Type",
      label: "Donation Type",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "Amount",
      label: "Amount",
      options: {
        filter: false,
        print: true,
        download: true,
        sort: false,
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <Link
                to={`/recepit-view/${id}`}
                style={{ display: userType === "4" ? "none" : "" }}
              >
                <MdOutlineRemoveRedEye
                  title="View"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </Link>
              <Link
                to={`/recepit-add/${id}`}
                style={{ display: userType === "2" ? "" : "none" }}
              >
                <MdEdit
                  title="Edit"
                  className="h-5 w-5 cursor-pointer text-blue-500"
                />
              </Link>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: "none",
    elevation: 0,

    responsive: "standard",
    download: false,
    print: false,
  };

  return (
    <Layout>
      <RequestFilter />
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Donation Receipts List
        </h3>
      </div>
      <div className="mt-5">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-12 w-12" color="purple" />{" "}
          </div>
        ) : (
          <MUIDataTable
            data={pendingRListData || []}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Layout>
  );
};

export default RecepitCashRecepit;
