import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";
import { Link } from 'react-router-dom';

import { Header } from "../components";

const Reclamation = () => {
  const [reclamtionData, setReclamationData] = useState([]);
  const selectionsettings = { persistSelection: true };
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    // Fetch data using Axios
    axios.get("http://127.0.0.1:5000/crud/reclamations") // Replace with your API endpoint
      .then((response) => {
        setReclamationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

const statusRender = (props) => {
  const status = props.status ? props.status : "";
  const statusClass = status.toLowerCase() === "pending" ? "text-green-600" : "text-red-600";

  return (
    <span className={`font-semibold ${statusClass}`}>{status}</span>
  );
};

const idRender = (props) => {
  // Custom rendering function for the new column with the button
  const id = props.id ? props.id : ""; // Assuming "id" is a property of your data
  return (
    <Link to={`/Details/${id}`} className="btn btn-primary">View Details</Link> // Adjust the link URL and button styling as needed
  );
};


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Reclamations" />
      <GridComponent
        dataSource={reclamtionData}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionsettings}
        editSettings={editing}
        allowSorting
      >
        <ColumnsDirective>
      <ColumnDirective
        field="client_name"
        headerText="client"
        width="150"
      />
      <ColumnDirective
        field="date"
        headerText="Date"
        width="130"
      />
      <ColumnDirective
        field="deadline"
        headerText="Deadline"
        width="130"
      />
      <ColumnDirective
        field="desc"
        headerText="Description"
        width="250"
      />
      
      <ColumnDirective
        field="object"
        headerText="Object"
        width="200"
      />
      <ColumnDirective
        field="status"
        headerText="Status"
        template={statusRender}
        width="100"
      />
      <ColumnDirective
        headerText="Actions" // Add a new column for the button
        template={idRender}
        width="150"
      />
    </ColumnsDirective>
        <Inject services={[Page, Selection,Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Reclamation;
