import moment from "moment";
import React, { useState } from "react";
import { BACKEND_URL } from "../../App";

const Summery = () => {
  const [date1, setDate1] = useState(new Date());
  const [date2, setDate2] = useState(new Date());
  const [data, setData] = useState(null);

  const onSubmit = () => {
    const d1 = moment(date1).format("YYYY-MM-DD");
    const d2 = moment(date2).format("YYYY-MM-DD");
    const token = localStorage.getItem("admin-token");
    fetch(`${BACKEND_URL}/api/v1/order/summery?from=${d1}&to=${d2}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  };

  return (
    <div>
      <div className="flex md:items-end gap-3 flex-col md:flex-row">
        <div className="grid gap-1">
          <label htmlFor="date1">From</label>
          <input
            type="date"
            id="date1"
            value={date1}
            onChange={(e) => setDate1(e.target.value)}
            className="border w-full bg-white border-gray-300 rounded-md p-1"
          />
        </div>
        <div className="grid gap-1">
          <label htmlFor="date2">To</label>
          <input
            type="date"
            id="date2"
            value={date2}
            onChange={(e) => setDate2(e.target.value)}
            className="border w-full bg-white border-gray-300 rounded-md p-1"
          />
        </div>
        <button onClick={onSubmit} className="btn bg-orange-500 text-white">
          Submit
        </button>
      </div>

      <div className="grid gap-6  mt-10">
        {/* Total Delivered */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-lg font-semibold">
            Total Delivered
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {data?.totalDelivered}
          </p>
        </div>

        {/* Total Returned */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-lg font-semibold">
            Total Returned
          </h3>
          <p className="text-2xl font-bold text-yellow-600">
            {data?.totalReturned}
          </p>
        </div>

        {/* Total Costing */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-lg font-semibold">Total Costing</h3>
          <p className="text-2xl font-bold text-blue-600">
            ৳{data?.totalCosting}
          </p>
        </div>

        {/* Total Selling Price */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-lg font-semibold">
            Total Selling Price
          </h3>
          <p className="text-2xl font-bold text-purple-600">
            ৳{data?.totalSellingPrice}
          </p>
        </div>

        {/* Total Profit */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-gray-600 text-lg font-semibold">Total Profit</h3>
          <p
            className={`text-2xl font-bold ${
              data?.totalProfit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ৳{data?.totalProfit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summery;
