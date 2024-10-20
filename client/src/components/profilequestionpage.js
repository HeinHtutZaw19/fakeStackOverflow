import Header from "./header.js"
import QuestionBoard from "./questionboard.js"

export default function ProfileQuestionPage(props){

    return(
        <div id="profile_question_page" className="page">
            <Header handleReturnToAdminProfile={props.handleReturnToAdminProfile} isAdmin={props.isAdmin} page={props.page}  isProfile={true} duration={props.getMetaData(props.user.createdAt,"Been here since")} reputation={props.reputation} role={props.user.role}  mode={props.user.user.split('@')[0]}  changePage={props.changePage} />
            <QuestionBoard questions={props.orderedQuestions.questions} handleQstnClick={props.handleQstnClick} getMetaData={props.getMetaData} displayNoQuestionsFound={(props.orderedQuestions.questions.length===0)}/>
        </div>
    );
}