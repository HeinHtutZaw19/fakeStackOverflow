import {useState} from 'react'

export default function QuestionFormText(props){
    const [err,setErr] = useState(false);
    return (
        <div>
            <div>
                <label style={{fontSize:"21px"}}>Question Text*</label>
            </div><br></br>

            <div>
                <label>Add Details</label>
            </div>
            <textarea 
                type="text" 
                name="question_text_text" 
                onInvalid={() => setErr(true)}
                onChange={(e)=>props.changeText(e.target.value)}
                rows={5} 
                cols={100} 
                value={props.text}
                required>
            </textarea>
            {
                err && 
                <p className="error">This cannot be empty.</p>
            }
            {
                !err &&
                <br></br>
            }
            <br></br><br></br>
        </div>
    );
}