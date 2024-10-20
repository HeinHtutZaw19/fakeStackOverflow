import {useState} from 'react'

export default function QuestionFormTitle(props){
    const [err,setErr] = useState(false);
    return (
        <div>
            <div>
                <label style={{fontSize:"21px"}}>Question Title*</label>
            </div><br></br>
            <div>
                <label>Limit title to 50 characters or less</label>
            </div>
            <input
                type="text"
                size={100}   
                onInvalid={()=>setErr(true)}    
                value={props.title}
                onChange={(e)=>{
                    if(e.target.value.length>50){
                        setErr(true)
                    }
                    else{
                        setErr(false)
                    }
                    props.changeTitle(e.target.value)
                }}
                required        
            />
            {
                err &&
                <p className="error">This cannot be empty or longer than 100 words.</p>
            }
            {
                !err &&
                <br></br>
            }
            <br></br><br></br>
        </div>
    );
}