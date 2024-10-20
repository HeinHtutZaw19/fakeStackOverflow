import QuestionInfo from "./questioninfo.js"
import AnswerBoard from "./answerboard.js"

import {useState} from 'react'

export default function AnswerPage(props){
    //State for the 5 comments to be shown
    const [idx,setIdx] = useState(0);
    const answers = []
    let i = (props.answers.length==idx) ? 0 : idx;
    let initial = i
    while(i<initial+5) {
        if(i>=props.answers.length){
            break;
        }
        answers.push(props.answers[i]);
        i++;
    }
    function convertLinks(text) {
        //eslint-disable-next-line
        const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
        return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    }
    return(
        <div id="answer_page" className="page">
            <QuestionInfo reputation={props.reputation} role={props.role} isProfile={props.isProfile} insertComment={props.insertComment} handleVote={props.handleVote} question={props.question} page={props.page} changePage={props.changePage} getMetaData={props.getMetaData} text={convertLinks(props.question.text)}/>
            <p style={{marginLeft:"3%"}} className="left_aligned bold grey"> {props.question.answers.length} {props.question.answers.length > 1 ? "answers" : "answer"} </p>   
            <AnswerBoard 
                reputation={props.reputation}
                isProfile={props.isProfile}
                handleAnswerClick={props.handleAnswerClick}
                insertComment={props.insertComment} 
                handleVote={props.handleVote} 
                handleAnswerDelete={props.handleAnswerDelete}
                answers={answers} 
                getMetaData={props.getMetaData} 
                text={answers.map((e)=>convertLinks(e.text))}
            />
            <div className="flex_horizontal" style={{display: 'flex', padding: '0% 1%', alignItems: 'start', width: '100%'}}>
                <span style={{flex:3}}></span>
                {idx >= 3 && props.answers.length !== idx &&
                    <div style={{flex:1}}>
                        <p className="grey_button"  onClick={(e) => { e.preventDefault(); setIdx(Math.max(i - 10, 0)) }}> Prev </p>
                    </div>
                }
                {!(idx >= 3 && props.answers.length !== idx) &&
                    
                    <span style={{flex:1}}></span>
                }
                <p style={{flex:1,color:'grey'}}>
                    {'Page '} <span style={{color:'orange'}}>{Math.ceil(i/5)}</span>
                </p>
                <div style={{flex:1}}>
                    <p className="grey_button"   onClick={(e) => { e.preventDefault(); setIdx(i) }}> Next </p>
                </div>
                <span style={{flex:3}}></span>
            </div>
        </div> 
    );
}