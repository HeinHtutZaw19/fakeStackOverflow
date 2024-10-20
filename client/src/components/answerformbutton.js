export default function AnswerFormButton(props){
    return(
        <div className="flex_horizontal">
            <div style={{flex:1}}>
                <input type="submit" value={props.isProfile ? "Update Answer" : "New Answer"} className="blue_button"/>
            </div>
            <span style={{flex:1}}></span>
            <p style={{color:"red"}}> *indicates mandatory fields </p>
        </div>
    );
}