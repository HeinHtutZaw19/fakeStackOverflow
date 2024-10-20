import Header from "./header.js"
import UserBoard from "./userboard.js"

export default function ProfileUsersPage(props){

    return(
        <div id="profile_users_page" className="page">
            <Header page={props.page}  isProfile={true} duration={props.getMetaData(props.user.createdAt,"Been here since")} reputation={props.reputation} role={'admin'}  mode={props.user.user.split('@')[0]}  changePage={props.changePage} />
            <UserBoard changeReputation={props.changeReputation} handleUserDelete={props.handleUserDelete} changeUser={props.changeUser} page={props.page}  isProfile={true} getMetaData ={props.getMetaData} users={props.users} changePage={props.changePage}/>
        </div>
    );
}