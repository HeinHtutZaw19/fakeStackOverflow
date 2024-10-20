import AnswerFormText from "./answerformtext.js";
import AnswerFormButton from "./answerformbutton.js"
import axios from 'axios'

axios.defaults.withCredentials = true

export default function AnswerFormPage(props){

    function handleSubmit(e){
        e.preventDefault();
        let data = new FormData(e.target);
        const regex = /\[([^\]]*)\]\(([^]*)/g
        let match=[];
        while ((match = regex.exec(props.text)) !== null) {
            const linkText = match[1].trim();
            const linkTarget = match[2];
            if (linkText==='' || (!linkTarget.startsWith('https://') && !linkTarget.startsWith('http://'))) {
                alert('Error: Invalid hyperlink target format. Hyperlink target must not be empty and must start with "https://" or "http://".');
                return ;
            }
        }        

        if(!props.isProfile){
            
            axios.post('http://127.0.0.1:8000/create/answer',{id: props.question._id, text: data.get('text'), ans_by: props.user}, {withCredentials: true})
                .then(res => {
                    props.changeQuestionInfo(res.data);
                })
                .catch(err=>{
                    console.log(err)
                })
            props.changePage('answer_page','new_answer_page');
        }
        else{
            axios.post('http://127.0.0.1:8000/update/answer', {
                id: props.id,
                text: data.get('text')
            }, {
                withCredentials: true
            })
            .then(res => {
                console.log(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
            axios.get('http://127.0.0.1:8000/create/question/' + props.qid + '/false', { withCredentials: true }).then(res=>{
                props.changeQuestionInfo(res.data);
            }).catch(err=>{
                console.log(err);
            });
            props.changePage('profile_answer_info_page','profile_update_answer_page');
        }
    }
    
    return (
        <div className="page">
            <form className="form_template" onSubmit={(e)=>handleSubmit(e)}>
                <AnswerFormText isProfile={props.isProfile} text={props.text}/>
                <AnswerFormButton isProfile={props.isProfile}/>
            </form>
        </div>
    );
}