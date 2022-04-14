import React, { useState } from "react";
import {useHistory} from "react-router-dom";

function NewTable({loadTables}){
    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState(1);

    const history = useHistory();

    async function handleSubmit(e){
      e.preventDefault();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data:{
            table_name: tableName,
            capacity: Number(capacity)
        } 
      })
    };
    fetch('http://localhost:5000/tables', requestOptions)
        .then(response => response.json())
        .then(data => console.log(data));
        await loadTables();
        history.push("/dashboard");
    }


    return(
        <form className="pl-3" onSubmit={handleSubmit}>
          <h3>New Table: </h3>
          <div class="mb-3">
                <label className="row">Table Name</label>
                <input className="row col-8" type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} name="table_name" placeholder="Table Name"/>
          </div>
          <div class="mb-3">
                <label className="row">Capacity</label>
                <input className="row col-8" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} name="capacity" min="1" />
          </div>
          <div className="row pl-3">
                <button className="btn btn-danger mx-2 text-center" onClick={() => history.goBack()}>Cancel</button>
                <button className="btn btn-success mx-2 text-center" type="submit">Submit</button>
          </div>
        </form>
    );
}

export default NewTable;