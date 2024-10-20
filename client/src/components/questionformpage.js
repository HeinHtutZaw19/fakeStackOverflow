import QuestionFormTitle from "./questionformtitle";
import QuestionFormText from "./questionformtext";
import QuestionFormTags from "./questionformtags";
import QuestionFormSummary from "./questionformsummary";
import QuestionFormPostButton from "./questionformpostbutton";

import {useState} from 'react'
import axios from 'axios';
axios.defaults.withCredentials = true
export default function QuestionFormPage(props){
    const [question,setQuestion] = useState({
        title: props.question_title,
        text: props.question_text,
        summary: props.question_summary,
        tags: props.question_tags.reduce((prev, cur) => prev + ' ' + cur.name, '').trim(),
        asked_by : props.user,
    })
    const [newTagCreatedErr, setErr] = useState(false);
    function handleSubmit(e){
        e.preventDefault();
        //eslint-disable-next-line
        const regex = /\[([^\]]*)\]\(([^\)]*)\)/g
        let match=[];
        while ((match = regex.exec(question.text)) !== null) {
            const linkText = match[1].trim();
            const linkTarget = match[2];
            if (linkText==='' || (!linkTarget.startsWith('https://') && !linkTarget.startsWith('http://'))) {
                alert('Error: Invalid hyperlink target format. Hyperlink target must not be empty and must start with "https://" or "http://".');
                return ;
            }
        }   
        const q = {
            title: question.title,
            text: question.text,
            summary: question.summary,
            tags: Array.from(new Set(question.tags.split(' '))),
            asked_by : question.asked_by,
        };
        if(q.summary.length>=140 || q.title.length>=140){
            return;
        }
        let availableTags = props.availableTags.map(t=>t.tag.name)
        let filtered = q.tags.filter((t)=>!availableTags.includes(t.toLowerCase()))
        if(filtered.length>0 && props.reputation<50){
            setErr(true);
            return;
        }
        else{
            setErr(false);
        }
        setQuestion(q);
        if(props.isProfile){
            axios.post('http://127.0.0.1:8000/update/question', {
                tags: q.tags.reduce((acc, tag, index) => {
                    if (index === 0) {
                        return tag;
                    } else {
                        return acc + '.' + tag;
                    }
                }, ''),
                title: q.title,
                text: q.text,
                summary: q.summary,
                id: props.id

            }, { withCredentials: true }).then(res => {
                if(res.data==='OK'){
                    axios.get('http://127.0.0.1:8000/find/'+props.user+'/question', { withCredentials: true }).then(res=>{
                        props.changeOrder("All Questions", "newest", res.data);  
                        props.changePage('profile_question_page','profile_update_question_page');
                    })
                }
                else{
                    console.log(res.data);
                }
            }).catch(err=>{
                console.log(err)
            })
        }
        else{
            axios.post('http://127.0.0.1:8000/create/question', 
                    {
                        tags: q.tags.reduce((acc, tag, index) => {
                            if (index === 0) {
                                return tag;
                            } else {
                                return acc + '.' + tag;
                            }
                        }, ''),
                        title: q.title,
                        text: q.text,
                        summary: q.summary,
                        asked_by: q.asked_by
                    }, { withCredentials: true }).then(res => {
                        props.changeOrder("All Questions", "newest", res.data);  
                        props.changePage('question_page','new_question_page');
                }).catch(err=>{
                    console.log(err)
                })
        }
    }

    function handleDelete(e){
        e.preventDefault();
        axios.get('http://127.0.0.1:8000/delete/question/' + props.id, { withCredentials: true }).then(res=>{
            if(res.data==='OK'){
                axios.get('http://127.0.0.1:8000/find/'+props.user+'/question', { withCredentials: true }).then(res=>{
                    props.changeOrder("All Questions", "newest", res.data);  
                    props.changePage('profile_question_page','profile_update_question_page');
                })
            }
        })
    }
    return (
        <div className="page" id="new_question_page">
            <form className="form_template" onSubmit={(e)=>handleSubmit(e)}>
                <QuestionFormTitle title={question.title} changeTitle={title=>setQuestion({title: title,text: question.text, summary: question.summary, tags: question.tags,asked_by : question.asked_by})}/>
                <QuestionFormSummary summary={question.summary} changeSummary={sum=>setQuestion({title: question.title,text: question.text, summary: sum, tags: question.tags,asked_by : question.asked_by})}/>
                <QuestionFormText text={question.text} changeText={text=>setQuestion({title: question.title,text: text, summary: question.summary, tags: question.tags,asked_by : question.asked_by})}/>
                <QuestionFormTags newTagCreatedErr={newTagCreatedErr} tags={question.tags} changeTags={tags=>setQuestion({title: question.title,text: question.text, summary: question.summary, tags: tags,asked_by : question.asked_by})}/>
                <QuestionFormPostButton handleDelete={handleDelete} isProfile={props.isProfile}/>
            </form>
        </div>
    );

}