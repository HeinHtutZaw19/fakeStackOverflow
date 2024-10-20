import Title from "./title.js";

export default function WelcomePage(props){
    return(
    <div className="page">
        <Title></Title>
        <div className="flex_vertical">
            <button className="blue_button"  onClick={()=>props.changePage('create_account_page','welcome_page')} style={{margin:"3%"}}> Register</button>
            <button className="blue_button" onClick={()=>props.changePage('login_page','welcome_page')}  style={{margin:"3%"}}> Log In</button> 
            <button className="blue_button" onClick={()=>props.changePage('question_page','welcome_page')}  style={{margin:"3%"}}> Continue As Guest</button> 
        </div>
    </div>
    );
}