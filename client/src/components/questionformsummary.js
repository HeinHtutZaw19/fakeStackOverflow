import {useState} from 'react'

export default function QuestionFormSummary(props){
    const [err,setErr] = useState(false);
    return (
        <div>
            <div>
                <label style={{fontSize:"21px"}}>Question Summary*</label>
            </div><br></br>

            <div>
                <label>Limit summary up to 140 characters or less</label>
            </div>
            <textarea 
                type="text" 
                
                onInvalid={() => setErr(true)}
                onChange={(e)=>{
                    if(e.target.value.length>140){
                        setErr(true)
                    }
                    else{
                        setErr(false)
                    }
                    props.changeSummary(e.target.value)
                }}
                rows={2} 
                cols={100} 
                value={props.summary}
                required>
            </textarea>
            {
                err && 
                <p className="error">This cannot be empty or longer than 140 characters.</p>
            }
            {
                !err &&
                <br></br>
            }
            <br></br><br></br>
        </div>
    );
}