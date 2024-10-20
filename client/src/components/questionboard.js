import Question from './question.js'
import NoQuestionsFound from './noquestionsfound.js';
import {useState} from 'react'

export default function QuestionBoard(props){
    const questionElements = [];
    //State for the 5 questions to be shown
    const [idx,setIdx] = useState(0);
    let i = (props.questions.length==idx) ? 0 : idx;
    let initial = i
    while(i<initial+5) {
        if(i>=props.questions.length){
            break;
        }
        let q = props.questions[i]
        questionElements.push(<Question key={q._id} comments={q.comments} id={q._id} title={q.title} answers={q.answers.length} views={q.views} askedBy={q.asked_by} askMetaData={props.getMetaData(q.ask_date_time)} tags={q.tags} handleQstnClick={props.handleQstnClick}/>);
        i++
    }
    return (
        <div>
            <div id="question_board" >
                {questionElements}
                <NoQuestionsFound displayNoQuestionsFound={props.displayNoQuestionsFound}/>
            </div>
            <div className="flex_horizontal" style={{alignItems: 'flex-start', padding: '2%', justifyContent: 'space-around'}}>
                {  
                    (idx>=5 && props.questions.length!=idx) &&
                    <div>
                        <button className="blue_button" onClick={()=>setIdx(Math.max(i-10, 0))}> Prev </button>
                    </div>
                }
                {  
                    !(idx>=5 && props.questions.length!=idx) &&
                    <span></span>
                }
                
                <div>
                    <button className="blue_button" onClick={()=>setIdx(i)}> Next </button>
                </div>
            </div>
        </div> 
        
    );
}