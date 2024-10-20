import Title from "./title.js";
import LogInForm from "./loginform.js";
import axios from 'axios'

export default function LogInPage(props){

    return(
        <div className="page" id="create_account_page">
            <Title></Title>
            <LogInForm changeReputation={props.changeReputation} changeLoggedIn={props.changeLoggedIn} changePage={props.changePage} changeUser={props.changeUser}></LogInForm>
        </div>
    )
}