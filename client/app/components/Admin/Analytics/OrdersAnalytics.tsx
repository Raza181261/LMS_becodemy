import React, { useEffect } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
  CartesianGrid,
  Legend,
} from "recharts";
import Loader from "../../Loader/Loader";
import { useGetOrdersAnalyticsQuery } from "../../../../redux/features/analytics/analyticsApi";
import { styles } from "../../../../app/styles/style";

type Props = {
  isDashboard?: boolean;
};

// const analyticsData = [
//   { name: "Page A", Count: 4000 },
//   { name: "Febe B", Count: 3000 },
//   { name: "Mare C", Count: 2000 },
//   { name: "Apre D", Count: 2780 },
// ];

export default function OrdersAnalytics({ isDashboard }: Props) {
  const {data, isLoading } = useGetOrdersAnalyticsQuery({});

  // useEffect(() => {}, []);

  const analyticsData: any = [];
  if (data) {
    data.orders.last12Months.forEach((item: any) => {
      analyticsData.push({ name: item.name, Count: item.count });
    });
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
          <div
            className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}
          >
            <h1
              className={`${styles.title} ${
                isDashboard && "!text-[20px]"
              } px-5 !text-start`}
            >
              Orders Analytics
            </h1>
            {!isDashboard && (
              <p className={`${styles.label} px-5`}>
                Last 12 months analytics data{" "}
              </p>
            )}
          </div>
          <div
            className={`w-full ${
              !isDashboard ? "h-[90%]" : "h-full "
            }flex items-center justify-center`}
          >
            <ResponsiveContainer
              width={isDashboard ? "100%" : "90%"}
              height={isDashboard ? "100%" : "50%"}
            >
              <LineChart
                width={500}
                height={300}
                data={analyticsData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isDashboard && <Legend />}
                <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

// export default OrdersAnalytics;
