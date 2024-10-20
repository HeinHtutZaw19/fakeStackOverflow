export default function NoQuestionsFound(props){
    return(
        <div id="no_qstns_found" className="flex_row_container">
            <h2 style={{justifyContent:'center', alignItems:'center', display: (props.displayNoQuestionsFound)?'inline-block':'none'}}> No Questions Found</h2>
        </div>
    );
}