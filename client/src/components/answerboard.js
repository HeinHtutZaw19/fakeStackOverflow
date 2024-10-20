import Answer from './answer.js'

export default function AnswerBoard(props){
    const answerElements = props.answers.map((a, index) => (
        <Answer
            key={a._id}
            id={a._id}
            reputation={props.reputation}
            text={props.text[index]}
            ans_by={a.ans_by}
            ansMetaData={props.getMetaData(a.ans_date_time, "answered")}
            getMetaData={props.getMetaData}
            comments = {a.comments}
            insertComment={props.insertComment} 
            handleVote = {props.handleVote}
            votes={a.votes}
            isProfile={props.isProfile}
            handleAnswerClick={()=>props.handleAnswerClick(a._id,a.text)}
            handleAnswerDelete={()=>props.handleAnswerDelete(a._id)}
        />
    ));
    return (
        <div id="answer_board">
            {answerElements}
        </div>
    );
}