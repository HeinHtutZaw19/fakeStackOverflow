export default function QuestionFormPostButton(props){
    return (
            <div className="flex_horizontal">
            <div>
                <input 
                    type="submit"
                    style={{flex:1}} 
                    className="blue_button" 
                    value = {props.isProfile ? "Update Question" : "New Question"}
                /> 
                {   
                    props.isProfile&&
                    <button 
                        style={{display:'inline-block', marginLeft:'30px'}} 
                        className="delete"
                        onClick={props.handleDelete}
                    > x
                    </button>
                }
            </div>
            <span style={{flex:1}}></span>
            <p style={{color:"red"}}> *indicates mandatory fields </p>
        </div>
    );
}