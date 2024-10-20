export default function NoTagsFound(props){
    return(
        <div id="no_tags_found" style={{border: 'none'}} className="flex_row_container">
            <h2 style={{justifyContent:'center', alignItems:'center', display: (props.displayNoTagsFound)?'inline-block':'none'}}> No Tags Found</h2>
        </div>
    );
}