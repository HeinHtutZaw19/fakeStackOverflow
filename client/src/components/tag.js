export default function Tag(props){
    function handleClick(){
        if(props.isProfile){
            props.handleTagClick(props.id,props.name)
        }
        else{
            props.handleTagClick(props.questions);
        }
    }
    return (
        <div style={{cursor:"pointer"}} onClick={props.isProfile?handleClick:()=>{}}>
            {
                props.isProfile &&
                <div style={{display: 'flex', flexDirection:'row'}}>
                    <span style={{flex: 10}}></span>
                    <button className="delete" style={{flex: 1}} onClick={()=>props.deleteTag(props.id)}>x</button>
                </div>
            }
            <button className={props.isProfile?"hover":''} style={{ border: 'hidden', color: 'blue', backgroundColor: 'white', fontSize: '16px' }}>{props.name}</button>
            <br></br>
            <p>{props.questions.length}</p>
        </div>
    );
}