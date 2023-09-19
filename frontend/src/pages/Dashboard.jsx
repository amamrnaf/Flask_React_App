import React, { useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { Stacked, Pie,SparkLine } from "../components";
import { AiFillFileExclamation,AiOutlineFileProtect,AiFillFileText } from 'react-icons/ai';
import axios from "axios";

import {
  SparklineAreaData,
  ecomPieChartData,
} from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";


const Dashboard = () => {
  const { currentColor, currentMode } = useStateContext();
  const [pendingCount, setPendingCount] = useState(0);
  const [finsihedCount, setFinishedCount] = useState(0);
  const [totatlCount, setCount] = useState(0);
  const [data,setData] = useState([]);
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
    useEffect(() => {
        // Make a GET request to the backend endpoint
        axios.get('http://127.0.0.1:5000/crud/pending-reclamations-count',axiosConfig)
            .then((response) => {
              setPendingCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching count:', error);
            });
        axios.get('http://127.0.0.1:5000/crud/finished-reclamations-count',axiosConfig)
            .then((response) => {
              setFinishedCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching count:', error);
            });
        axios.get('http://127.0.0.1:5000/crud/reclamations-count',axiosConfig)
            .then((response) => {
              setCount(response.data.count);
            })
            .catch((error) => {
                console.error('Error fetching count:', error);
            });
        axios.get('http://127.0.0.1:5000/crud/reclamations_by_organization_data',axiosConfig)
            .then((response) => {
              setData(response.data);
              console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching count:', error);
            });
    }, []);


  return (
    <div className="mt-24">
      <div className="flex flex-wrap lg:flex-nowrap justify-center ">
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          
            <div
              key='Pending'
              className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <AiFillFileExclamation />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{pendingCount}</span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Unfinished reclamation</p>
            </div>
            <div
              key='Finished'
              className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: '#03C9D7', backgroundColor: '#E5FAFB' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <AiOutlineFileProtect />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{finsihedCount}</span>
              </p>
              <p className="text-sm text-gray-400  mt-1">Finished reclamation</p>
            </div>
            <div
              key='total'
              className="bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: 'rgb(0, 194, 146)', backgroundColor: 'rgb(235, 250, 242)' }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <AiFillFileText />
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">{totatlCount}</span>
              </p>
              <p className="text-sm text-gray-400  mt-1">All reclamations</p>
            </div>
            

            
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780  ">
          <div className="flex justify-between">

            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Budget</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            
            <div>
              <Stacked currentMode={currentMode} width="320px" height="360px" />
            </div>
          </div>
        </div>
        <div>

          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl md:w-400 p-8 m-3 flex justify-center items-center gap-10">
            <div>
              <p className="text-2xl font-semibold ">$43,246</p>
              <p className="text-gray-400">Yearly sales</p>
            </div>

            <div className="w-40">
              <Pie
                id="pie-chart"
                data={data}
                legendVisiblity={false}
                height="320px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
