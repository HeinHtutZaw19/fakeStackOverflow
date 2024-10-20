import Header from './header.js'
import NoQuestionsFound from './noquestionsfound.js';
import {useState} from 'react'

export default function UserBoard(props){
    const userElements = [];
    for(const user of props.users){
        userElements.push(<Header changeReputation={props.changeReputation} reputation={user.reputation} handleUserDelete={props.handleUserDelete} changeUser={props.changeUser} isUser={true} key={user.email} email={user.email} page={props.page}  isProfile={true} duration={props.getMetaData(user.createdAt,"Been here since")} role={'guest'}  mode={user.email.split('@')[0]}  changePage={props.changePage} />)
    }
    return (
        <div>
            <div id="question_board" >
                {userElements}
                <NoQuestionsFound displayNoQuestionsFound={props.displayNoQuestionsFound}/>
            </div>
        </div> 
        
    );
}