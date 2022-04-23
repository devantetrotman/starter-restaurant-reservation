import React from "react";
import useState from 'react-usestateref';
import {useHistory} from "react-router-dom";
import "../style.css";
import ErrorAlert from "./ErrorAlert";


function NewTable({loadTables}){
    const [tableName, setTableName] = useState("");
    const [capacity, setCapacity] = useState(1);
    const [errorMessage, setErrorMessage, errorMessageRef] = useState({});
    const [isError, setIsError, isErrorRef] = useState(false);

    const history = useHistory();

    async function handleSubmit(e){
      e.preventDefault();
      setIsError(false);
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
      try{
        const response = await fetch('http://localhost:5000/tables', requestOptions);
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201){
            throw data.error;
        }
      }catch(error){
            setIsError(true);
            setErrorMessage({message: error});
      }
      if (!isErrorRef.current){
            await loadTables();
            history.push("/dashboard");
      }
    }

    return(
      <div>
      {isErrorRef.current && <ErrorAlert error={errorMessageRef.current}/>}
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