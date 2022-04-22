import React, { useState } from "react";
import {useHistory} from "react-router-dom";
import "../style.css";

function NewTable({loadTables, errorMessage, setErrorMessage}){
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
        .then(data => setErrorMessage(data.error));
        await loadTables();
        history.push("/dashboard");
    }


    return(
      <div>
      {errorMessage && <p>{errorMessage}</p>}
        <form className="pl-3" onSubmit={handleSubmit}>
          <h3>New Table: </h3>
          <div className="form-line">
                <label className="form-label">Table Name:</label>
                <input className="form-input" type="text" value={tableName} onChange={(e) => setTableName(e.target.value)} name="table_name" placeholder="Table Name"/>
          </div>
          <div className="form-line">
                <label className="form-label">Capacity:</label>
                <input className="form-input" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} name="capacity" min="1" />
          </div>
          <div className="form-buttons">
                <button className="cancel-btn" onClick={() => history.goBack()}>Cancel</button>
                <button className="submit-btn" type="submit">Submit</button>
          </div>
        </form>
        </div>
    );
}

export default NewTable;