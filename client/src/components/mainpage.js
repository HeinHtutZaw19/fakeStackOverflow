import QuestionPage from "./questionpage.js";
import TagPage from "./tagpage.js";
import AnswerPage from "./answerpage.js";
import QuestionFormPage from "./questionformpage.js";
import AnswerFormPage from "./answerformpage.js";
import TagFormPage from "./tagformpage.js";

import CreateAccountPage from "./createaccountpage.js";
import WelcomePage from "./welcomepage.js";
import LogInPage from "./loginpage.js"

import {useState} from 'react'
import axios from 'axios';
import ProfileQuestionPage from "./profilequestionpage.js";
import ProfileUsersPage from "./profileuserspage.js";

axios.defaults.withCredentials = true

export default function MainPage(props){
    let page=props.page;
    let orderedQuestions = props.orderedQuestions
    let changeOrder = props.changeOrder;
    let changeUser = props.changeUser;
    let availableTags = props.availableTags;
    let handlePageChange = props.handlePageChange;
    //State for showing answer page
    const [question,setQuestion] = useState(orderedQuestions.questions[0]);
    const [answer, setAnswer] = useState({id:0, text:'default'})
    const [tag, setTag] = useState({id:0, text: 'default'})
    //State for user

    function getMetaData(d, mode="asked"){
        const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const curDate = new Date();
        const date = new Date(d);
        const dh = Math.floor((curDate - date)/(1000 * 60 * 60));
        const dm = Math.floor((curDate - date)/(1000 * 60));
        const ds = Math.floor((curDate - date)/(1000));

        let m = date.getMinutes();
        m = (m/10>=1) ? m : "0" + m;

        if(dh<=8760){
            if(dh<=24){
                if(dh===0){
                    if(dm===0){
                        return mode + ` ${ds} ${ds>1 ? "seconds ago." : "second ago."}`
                    }
                    return mode + `  ${dm} ${dm>1 ? "minutes ago." : "minute ago."}` 
                }
                return mode + ` ${dh} ${dh>1 ? "hours ago." : "hour ago."}`
            }
            else{
                return mode + ` ${month[date.getMonth()]} ${date.getDate()} at ${date.getHours()}:${m}.`
            }
        }
        else{
            return mode + ` ${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${m}.`
        }
    } 

    /* Event Handlers */

    function handleQstnClick(id){
        axios.get('http://127.0.0.1:8000/create/question/' + id + '/true', { withCredentials: true }).then(res=>{
            props.changePage('answer_page', page.to);
            setQuestion(res.data);
        });
    }

    function handleTagClick(questions){
        props.changePage('question_page', page.to);
        changeOrder("All Questions", "newest", questions);
    }

    function handleVote(mode, id, vote, opt){
        axios.get('http://127.0.0.1:8000/'+ mode +'/vote/' + id + '/' + vote, { withCredentials: true }).then(res=>{
            setQuestion(res.data);
        }); 
        axios.get('http://127.0.0.1:8000/find/user/'+props.user.user, { withCredentials: true }).then(res=>{
            props.changeUser(res.data.email,res.data.isAdmin?"admin":"registered",res.data.createdAt);
        })
        if(opt==='up'){
            props.changeReputation(props.reputation+5);
        }
        else if(opt==='down'){
            props.changeReputation(props.reputation-10)
        }
        
    }

    function insertComment(id, mode, cmt){
        axios.post('http://127.0.0.1:8000/create/comment/',
        {
            mode: mode,
            id: id,
            text: cmt,
            cmt_by: props.user.user
        }, { withCredentials: true }).then(res=>{
            setQuestion(res.data);
        })
    }

    function handleDeleteTag(id){
        axios.get('http://127.0.0.1:8000/delete/tag/'+id, { withCredentials: true }).then(async(res)=>{
            let tagsRes = await axios.get('http://127.0.0.1:8000/find/'+props.user.user+'/tag', { withCredentials: true });
            let tags = tagsRes.data;
            const tagArray = []
    
            for (let tag of tags) {
                try {
                    let tagRes = await axios.post('http://127.0.0.1:8000/search/tags/',{tags:[tag.name]}, { withCredentials: true });
                    let questions = tagRes.data;
                    tagArray.push({ tag: tag, question: questions });
                } catch (err) {
                    console.log(err);
                }
            }
            props.changeAvailableTags(tagArray);
        })
    }

    function handleOrderBtnClick(ord){
        if(page.from==='search'){
            let q = props.searchedQuestions;
            if(ord==='newest'){
                q = q.sort((a,b)=>new Date(b.ask_date_time)-new Date(a.ask_date_time));
            }
            else if(ord==='active'){
                q = q.sort((a,b)=>{
                    const lastAnsDateA = a.answers.length > 0 ? a.answers[a.answers.length - 1].ans_date_time : new Date('1970-01-01T00:00:00.000Z');
                    const lastAnsDateB = b.answers.length > 0 ? b.answers[b.answers.length - 1].ans_date_time : new Date('1970-01-01T00:00:00.000Z');
                    return new Date(lastAnsDateB) - new Date(lastAnsDateA);
                });
            }
            else if(ord==='unanswered'){
                q = q.filter((question) => question.answers.length==0);
            }
            changeOrder("Search Questions", ord, q);
        }
        else{
            axios.get('http://127.0.0.1:8000/question/' + ord, { withCredentials: true })
            .then(res => {
                changeOrder("All Questions", ord, res.data);
                this.flag = true
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    function handleAnswerClick(id,text){
        setAnswer({id:id, text:text});
        props.changePage('profile_update_answer_page', 'profile_show_answer_page');
    }

    function handleAnswerDelete(id){
        axios.get('http://127.0.0.1:8000/delete/answer/' + id, { withCredentials: true }).then(res=>{
            axios.get('http://127.0.0.1:8000/create/question/' + question._id + '/false', { withCredentials: true }).then(res=>{
                setQuestion(res.data);
            });
        });
    }
    
    function handleTagUpdate(id,text){
        axios.post('http://127.0.0.1:8000/update/tag',{id:id,text:text}, { withCredentials: true }).then(async(res)=>{
            let tagsRes = await axios.get('http://127.0.0.1:8000/find/'+props.user.user+'/tag', { withCredentials: true });
            let tags = tagsRes.data;
            const tagArray = []
    
            for (let tag of tags) {
                try {
                    let tagRes = await axios.post('http://127.0.0.1:8000/search/tags/',{tags:[tag.name]}, { withCredentials: true });
                    let questions = tagRes.data;
                    tagArray.push({ tag: tag, question: questions });
                } catch (err) {
                    console.log(err);
                }
            }
            props.changeAvailableTags(tagArray);
            props.changePage('profile_tag_page', 'profile_update_tag_page');
        });
    }

    return (
        <div className="main">
            {
                page.to==='question_page' &&
                (<QuestionPage reputation={props.reputation} handleOrderBtnClick={handleOrderBtnClick} handleQstnClick={handleQstnClick} getMetaData={getMetaData} orderedQuestions={props.orderedQuestions} changePage={props.handlePageChange} role={props.user.role}/>)
            }
            {
                page.to==='answer_page' &&
                (<AnswerPage changeReputation={props.changeReputation} reputation={props.reputation} role={props.user.role} changePage={handlePageChange} isProfile={false} insertComment={insertComment} handleVote={handleVote} question={question} page={props.page} getMetaData={getMetaData} answers={question.answers}/>)
            }
            {
                page.to ==='tags_page' && 
                (<TagPage user={props.user} changeAvailableTags={props.changeAvailableTags} deleteTag={handleDeleteTag} availableTags={availableTags} page={props.page} changePage={props.handlePageChange} handleTagClick={handleTagClick}/>)
            }
            {
                page.to === 'new_question_page' && 
                <QuestionFormPage reputation={props.reputation} availableTags={props.availableTags} question_title={''} question_text={''} question_summary={''} question_tags={[]} user={props.user.user} changePage={props.handlePageChange} orderedQuestions={props.orderedQuestions} changeOrder={props.changeOrder}/>
            }
            {
                page.to === 'new_answer_page' &&
                <AnswerFormPage  text={''} user={props.user.user} changePage={handlePageChange} changeQuestionInfo={(q)=>setQuestion(q)} question={question}/>
            }
            {
                page.to === 'welcome_page' &&
                <WelcomePage changePage={handlePageChange}/>
            }
            {
                page.to === 'create_account_page' && 
                <CreateAccountPage changePage={handlePageChange}/>
            }
            {
                page.to === 'login_page' &&
                <LogInPage changeReputation={props.changeReputation} changeLoggedIn={props.changeLoggedIn} changePage={handlePageChange} changeUser={changeUser}/>
            }
            {
                page.to === 'profile_update_question_page' && 
                <QuestionFormPage reputation={props.reputation} availableTags={props.availableTags} id={question._id} question_title={question.title} question_text={question.text} question_summary={question.summary} question_tags={question.tags} isProfile={true} user={props.user.user} changePage={props.handlePageChange} orderedQuestions={props.orderedQuestions} changeOrder={props.changeOrder}/>
            }
            {
                page.to === 'profile_question_page' &&
                <ProfileQuestionPage reputation={props.reputation} handleReturnToAdminProfile={props.handleReturnToAdminProfile} isAdmin={props.isAdmin}  page={page} user={props.user} changePage={props.handlePageChange} orderedQuestions={props.orderedQuestions} getMetaData={getMetaData} handleQstnClick={(id)=>{
                    axios.get('http://127.0.0.1:8000/create/question/' + id + '/false', { withCredentials: true }).then(res=>{
                        props.changePage('profile_update_question_page', page.to);
                        setQuestion(res.data);
                    });
                    
                }}/>
            }
            {
                page.to === 'profile_answer_page' &&
                <ProfileQuestionPage reputation={props.reputation} handleReturnToAdminProfile={props.handleReturnToAdminProfile} isAdmin={props.isAdmin} page={page}  user={props.user} changePage={props.handlePageChange} orderedQuestions={props.orderedQuestions} getMetaData={getMetaData} handleQstnClick={(id)=>{
                    axios.get('http://127.0.0.1:8000/question/answer/' + id + '/' + props.user.user, { withCredentials: true }).then(res=>{
                        props.changePage('profile_answer_info_page', page.to);
                        setQuestion(res.data);
                    });
                }}/>
            }
            {
                page.to==='profile_answer_info_page' &&
                (<AnswerPage reputation={props.reputation} changeReputation={props.changeReputation}
                  changePage={handlePageChange} isProfile={true} handleAnswerDelete={handleAnswerDelete} handleAnswerClick={handleAnswerClick} insertComment={insertComment} handleVote={handleVote} question={question} page={props.page} getMetaData={getMetaData} answers={question.answers}/>)
            }
            {
                page.to === 'profile_update_answer_page' &&
                <AnswerFormPage qid={question._id} isProfile={true} id={answer.id} user={props.user.user} text={answer.text} changePage={props.handlePageChange} changeQuestionInfo={(q)=>setQuestion(q)} question={question}/>
            }
            {
                page.to ==='profile_tag_page' && 
                (<TagPage reputation={props.reputation} handleReturnToAdminProfile={props.handleReturnToAdminProfile} isAdmin={props.isAdmin} user={props.user} getMetaData={getMetaData} deleteTag={handleDeleteTag} isProfile={true} availableTags={availableTags} page={props.page} changePage={props.handlePageChange} handleTagClick={(id,text)=>{setTag({id:id,text:text}); props.handlePageChange('profile_update_tag_page','profile_tag_page')}}/>)
            }
            {
                page.to==='profile_update_tag_page' &&
                <TagFormPage text={tag.text} id={tag.id} changePage={props.handlePageChange} handleTagUpdate={handleTagUpdate}/>
            }
            {
                page.to === 'profile_users_page' &&
                <ProfileUsersPage changeReputation={props.changeReputation} reputation={props.reputation} handleUserDelete={props.handleUserDelete} changeUser={props.changeUser} user={props.user} users={props.users} page={props.page} getMetaData ={getMetaData} changePage={props.handlePageChange} />
            }
        </div> 
    );
}