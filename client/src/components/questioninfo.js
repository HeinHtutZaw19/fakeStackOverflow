import CommentBoard from "./commentboard";

export default function QuestionInfo(props){
    const question = props.question;
    const tagElements = [];
    for(let tag of question.tags){
      tagElements.push(<span key={tag._id} className="tag_name">{tag.name}</span>);
    }
    return (
        <div id="question_elaboration">
            <div className="question_info">
                <p style={{flex: 1, marginLeft:"3%"}} className="left_aligned bold grey"> {question.views} {question.views > 1 ? "views" : "view"}</p>
                
                <div className="column_flex" style={{flex: 4, padding: '1%'}}>
                    <p className="bold left_aligned" > {question.title} </p>
                    <div>
                        <div className="left_aligned">
                            {tagElements}
                        </div>
                    </div>
                </div>
                <div style={{flex: 1}}>
                    {
                        !props.isProfile && props.role!=='guest' &&
                        <button className="blue_button" onClick={()=>props.changePage("new_question_page",props.page.to)}> <strong>Ask Question</strong> </button>
                    }
                </div>
                <div style={{flex: 1}}>
                    {
                        !props.isProfile && props.role!=='guest' &&
                        <button className="blue_button" onClick={()=>props.changePage('new_answer_page','answer_page')}> <strong>Answer Question</strong> </button>
                    }
                </div>
            </div>
            <div className="question_info">
                        <div className="column_flex" style={{flex: 1, padding: '1%', alignItems: 'center'}}>
                        {
                            props.reputation>=50&&
                            <span>
                                <div className="upvote-btn" onClick={()=>{props.handleVote("question", question._id, question.votes+1, 'up')}}>&#9650;</div>
                                <div>{question.votes}</div>
                                <div className="downvote-btn" onClick={()=>{props.handleVote("question", question._id, question.votes-1, 'down')}}>&#9660;</div>
                            </span>
                        }
                        </div>
                <p className="left_aligned" style={{flex: 5, padding: '1%'}} dangerouslySetInnerHTML={{ __html: props.text }}></p>
                <p className="questioner_name" style={{display:'inline-block'}}> {question.asked_by.split('@')[0].trim() + " \0"}</p>
                <p className="left_aligned" style={{marginRight:'2%'}}> {props.getMetaData(question.ask_date_time)} </p>
            </div>
            <CommentBoard reputation={props.reputation} id={props.question._id} mode='question' getMetaData={props.getMetaData} insertComment={props.insertComment} comments={question.comments} handleVote={(id,vote)=>props.handleVote('qcomment', id ,vote)}/>
        </div>
    );
}