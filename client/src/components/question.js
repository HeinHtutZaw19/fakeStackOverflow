export default function Question(props){    
    function handleQstnClick(){
      props.handleQstnClick(props.id);
    }
    const tagElements = [];
    for(let tag of props.tags){
      tagElements.push(<span key={tag._id} className="tag_name">{tag.name}</span>);
    }
    if(tagElements.length==0){
      tagElements.push(<span key={'untagged'} className="tag_name" style={{backgroundColor:"grey"}}>{'untagged'}</span>);
    }
    return (
        <div className="question">
            <div className="count_container">
                <p> {props.answers}  {(props.answers>1)?"answers":"answer"}</p>
                <p> {props.views} {(props.views>1)?"views":"view"}</p>
            </div>
            <div className="title_container">
                <p className="question_title hover" onClick={handleQstnClick}> {props.title}</p>
            </div>
            <div className="questioner_container">
                <p> <span className="questioner_name">{props.askedBy.split('@')[0]}</span> {props.askMetaData}</p>
            </div>    
            <div className="tag_container">
              {tagElements}
            </div>
        </div>
    );

}