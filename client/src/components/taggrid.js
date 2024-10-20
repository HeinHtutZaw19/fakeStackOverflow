import NoTagsFound from './notagsfound.js';
import Tag from './tag.js'


export default function TagGrid(props){
    let tags = props.tags.map(t=>t.tag.name);
    let ids = props.tags.map(t=>t.tag._id);
    let asked_bys = props.tags.map(t=>new Set(t.question.map(q=>q.asked_by)))
    const tagElements = [];
    for (let i=0; i<tags.length; i++) {
        tagElements.push(<Tag deleteTag={props.deleteTag} isProfile={props.isAdmin?props.isProfile:props.isProfile && asked_bys[i].size==1} key={tags[i]} id={ids[i]} name={tags[i]} questions={props.questions[i]} handleTagClick={props.handleTagClick}/>);
    }  
    return (
        <div id="tag_grid" style={{height: props.isProfile?'50vh':'65vh'}}>
            {tagElements}
            <NoTagsFound displayNoTagsFound={tagElements.length===0}/>
        </div>
    );
    
}