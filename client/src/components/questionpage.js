import Header from "./header.js"
import QuestionBoard from "./questionboard.js"

export default function QuestionPage(props){

    return(
        <div id="question_page" className="page">
            <Header role={props.role} count={props.orderedQuestions.questions.length} mode={props.orderedQuestions.display} handleOrderBtnClick={props.handleOrderBtnClick} changePage={props.changePage} />
            <QuestionBoard questions={props.orderedQuestions.questions} handleQstnClick={props.handleQstnClick} getMetaData={props.getMetaData} displayNoQuestionsFound={(props.orderedQuestions.display==='Search Questions' && props.orderedQuestions.length===0)}/>
        </div>
    );
}