import React from "react";
import useState from 'react-usestateref';
import {useHistory, useParams} from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import "../style.css";


function ReservationSeat({tables, loadTables}){
    const [table_id, setTable_id] = useState(1);
    const [errorMessage, setErrorMessage, errorMessageRef] = useState({});
    const [isError, setIsError, isErrorRef] = useState(false);

    const {reservation_id} = useParams();
    const history = useHistory();

    async function handleSubmit(e){
      e.preventDefault();
      setIsError(false);
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data:{
                reservation_id: reservation_id
        } 
      })
    };
    try{
        const response = await fetch(`http://localhost:5000/tables/${table_id}/seat/`, requestOptions);
        const data = await response.json();
            if (response.status !== 200){
                throw data.error;
            }
          }catch(error){
              setErrorMessage({message: error});
              setIsError(true);
          }
          if (!isErrorRef.current){
            await loadTables();
            history.push("/dashboard");
          }
    }

    return(
        <div>
            {isErrorRef.current && <ErrorAlert error={errorMessageRef.current}/>}
            <form onSubmit={handleSubmit}>
                    <h3>Seat Reservation</h3>
                    <div className="form-line">
                        <label className="form-label">Choose Table ID:</label>
                        <select className="form-input" id="table_id" name="table_id" onChange={(e) => setTable_id(e.target.value)}>
                            {tables.map((table) => (
                                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button className="cancel-btn" onClick={() => history.goBack()}>Cancel</button>
                        <button className="submit-btn" type="submit">Submit</button>
                    </div>
            </form>
        </div>
    );
}

export default ReservationSeat;