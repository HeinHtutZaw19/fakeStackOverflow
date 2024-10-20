export default function TagHeader(props){
    return(
        <div className = "flex_row_container" style={{height: props.isProfile?'3vh':'5vh', padding: "1%"}}>
            <p className="bold"> {props.length} tags </p>
            <p className="bold"> All tags</p>
            <div>
                {
                    !props.isProfile&& props.role!='guest' &&
                    <button className="blue_button" onClick={()=>props.changePage("new_question_page",props.page.to)}> <strong>Ask Question</strong> </button>
                }
            </div>
        </div>);
}