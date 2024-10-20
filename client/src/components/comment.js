export default function Comment(props){
    return (
        <div style={{marginLeft:'3%', borderBottom: '1px solid lightgrey'}}>
            <span className="upvote-btn" style={{marginLeft:'1%'}} onClick={()=>{props.handleVote(props.id, props.votes+1,'none')}}>&#9650;</span>
            <span style={{color:'grey', marginRight:'3%'}}> {' \0' + props.votes + ' \0'}</span>
            <span>{props.text + ' - '} <span style={{color: "blue"}}>{props.cmt_by.split('@')[0] + ' \0'}</span> <span style={{color:'grey'}}>{props.cmtMetaData}</span></span>
        </div>
    );
}