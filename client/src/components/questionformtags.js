import {useState} from 'react'

export default function QuestionFormTags(props){
    const [err,setErr] = useState(false);
    return(
        <div>
            <div>
                <label style={{fontSize:"21px"}}>Tags*</label>
            </div><br></br>
            <div>
                <label>Add keywords seperated by whitespace</label>
            </div>
            <input
                type="text"  
                name="question_tags_text" 
                placeholder="Enter tags here" 
                size={100}
                pattern="^[\w\-]{1,20}( [\w\-]{1,20}){0,4}$" 
                title="This is a whitespace-separated list. Should not be more than 5 tags. Each tag is one word, hyphenated words are considered one word. The length of a new tag cannot be more than 20 characters."
                required
                onInvalid={() => setErr(true)}
                onChange={(e)=>props.changeTags(e.target.value)}
                value={props.tags}
                />
                <br></br><br></br> 
                {
                    err &&
                    <p className="error"> This does not match the required format. </p>
                }
                {
                    props.newTagCreatedErr &&
                    <p className="error"> Must have at least 50 reputation pts to create new tag </p>
                }
                {
                    !err &&
                    <br></br>
                }
        </div>       
    );
}