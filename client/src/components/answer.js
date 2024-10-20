import CommentBoard from "./commentboard";

export default function Answer(props){
    return (
        <div style={{borderBottom: 'lightgrey solid 1px'}}>
            
            <div className="answer_container">
            {
                props.isProfile&&
                <div style={{margin:'2%'}}>
                    <button className="delete" onClick={()=>props.handleAnswerDelete()}>x</button>
                </div>
            }
                <div className="column_flex" style={{flex: 1, padding: '1%', alignItems: 'center'}}>
                {
                    props.reputation>=50&&
                    <div> 
                        <div className="upvote-btn" onClick={()=>{props.handleVote("answer", props.id, props.votes+1,'up')}}>&#9650;</div>
                        <div>{props.votes}</div>
                        <div className="downvote-btn" onClick={()=>{props.handleVote("answer", props.id, props.votes-1,'down')}}>&#9660;</div>
                    </div>
                }
                </div>
                <p 
                    onClick={props.isProfile ? props.handleAnswerClick : () => {}}
                    className = {props.isProfile?"hover left_align":"left_align"}
                    style={{flex: 6, paddingRight: '2%'}} 
                    dangerouslySetInnerHTML={{ __html: props.text }}>
                </p>
                <div style={{flex: 1}}>
                    <span style={{textAlign: "left", color: "green"}}>{props.ans_by.split('@')[0] + ' \0'}</span>
                    <p>{props.ansMetaData}</p>
                </div>
            </div>
            <CommentBoard reputation={props.reputation} id={props.id} mode='answer' getMetaData={props.getMetaData} insertComment={props.insertComment} comments={props.comments} handleVote={(id,vote)=>props.handleVote('acomment', id ,vote)}/>
        </div>
    );
}