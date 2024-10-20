
import axios from 'axios';

axios.defaults.withCredentials = true
export default function Header(props){
    //TODO implement the state
    
    function handleClick(e){
        props.handleOrderBtnClick(e.target.innerText.toLowerCase());
    }

    function handleAskQuestion(e){
        props.changePage("new_question_page", "question_page");
    }

    async function handleUserClick(){
        axios.get('http://127.0.0.1:8000/find/user/'+props.email, { withCredentials: true }).then(res=>{
            props.changeUser(res.data.email,res.data.isAdmin?"admin":"registered",res.data.createdAt);
            props.changeReputation(res.data.reputation)
            props.changePage("profile_question_page", "profile_users_page", props.email);
        })
    }


    return (
        <div id="header" className={props.isUser ? "flex_horizontal" : ""}>
            {
                props.isUser &&
                <div style={{flex: 1, paddingLeft:'5%'}}>
                     <button className="delete" onClick={()=>{props.handleUserDelete(props.email)}}>x</button>
                </div>
               
            }
            <div className="flex_row_container" style={{flex: 10}}>
                <div>
                    {
                     props.isAdmin &&
                     <i className="arrow left" onClick={()=>props.handleReturnToAdminProfile()}></i> 
                    }
                    <h2  style={{display:'inline-block'}} className={props.isUser ? "hover_transform" : ""} onClick={props.isUser ? handleUserClick:()=>{}}>{props.mode} {
                        props.isProfile && 
                        <span style={{color:'grey'}}>{": "} <span style={{color:'orange'}}>{props.reputation}</span></span>
                    }</h2>
                </div>
                
                {
                    props.role === 'guest' &&
                    <span> </span>
                }
                {
                    props.role !== 'guest' && !props.isProfile &&
                    <button className="blue_button" onClick={handleAskQuestion}> <strong>Ask Question</strong> </button>
                }
            </div>
            {
                props.isProfile &&
                <div className="flex_row_container">
                    <p style={{color:'grey'}}> {props.duration}</p>
                    {
                        !props.isUser&&
                        <table> 
                            <tbody>
                                <tr>
                                    {
                                        props.role==='admin' &&
                                        <td> <button onClick = {()=>props.changePage('profile_users_page', props.page.to)} className="option_button">Users</button> </td>
                                    }
                                    <td> <button onClick = {()=>props.changePage('profile_question_page', props.page.to)} className="option_button">Asked</button> </td>
                                    <td> <button onClick = {()=>props.changePage('profile_answer_page', props.page.to)} className="option_button">Answered</button> </td>
                                    <td> <button onClick = {()=>props.changePage('profile_tag_page', props.page.to)} className="option_button">Tagged</button> </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
            }
            {!props.isProfile &&
                <div className="flex_row_container">
                    <h3> {props.count} {props.count>1?"questions":"question"}</h3>
                    
                    <table> 
                        <tbody>
                            <tr>
                                <td> <button onClick = {handleClick} className="option_button">Newest</button> </td>
                                <td> <button onClick = {handleClick} className="option_button">Active</button> </td>
                                <td> <button onClick = {handleClick} className="option_button">Unanswered</button> </td>
                            </tr>
                        </tbody>
                    </table>
                </div>  
            }
        </div>    
    );
}