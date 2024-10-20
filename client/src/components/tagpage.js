import TagHeader  from './tagheader.js';
import TagGrid from './taggrid.js';
import Header from "./header.js"

export default function TagPage(props){
    return(
        <div id="tags_page" className="page"> 
        {
            props.isProfile&&
            <Header handleReturnToAdminProfile={props.handleReturnToAdminProfile} isAdmin={props.isAdmin} page={props.page} isProfile={true} duration={props.getMetaData(props.user.createdAt,"Been here since")} reputation={props.reputation} role={props.user.role}  mode={props.user.user.split('@')[0]}  changePage={props.changePage} />
        }
            <TagHeader role={props.user.role} isProfile={props.isProfile} length={props.availableTags.length} changePage={props.changePage} page={props.page}/>
            <TagGrid isAdmin={props.isAdmin} isProfile={props.isProfile} deleteTag={props.deleteTag} tags={props.availableTags} questions={props.availableTags.map(t=>t.question)} handleTagClick={props.handleTagClick}/>
        </div>
    );
}