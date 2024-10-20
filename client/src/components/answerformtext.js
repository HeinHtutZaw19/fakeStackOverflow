import {useState} from 'react'

export default function AnswerFormText(props){
    const [err,setErr] = useState(false);
    return (
        <div>
            <label style={{fontSize:"21px"}}>Answer Text*</label>
            <br></br><br></br>
            <textarea 
                type="text" 
                rows={10}
                cols={100} 
                name="text"
                onInvalid={()=>setErr(true)}
                defaultValue={props.text}
                required ></textarea>
            <br></br>
            {
                err &&
                <p className="error">This should not be empty</p>
            }
            { 
                !err && 
                <br></br>
            }
        </div>
    );
}