import TagFormText from "./tagformtext.js";
import TagFormButton from "./tagformbutton.js"

export default function TagFormPage(props){

    function handleSubmit(e){
        e.preventDefault();
        let data = new FormData(e.target);
        props.handleTagUpdate(props.id, data.get('tag'))
    }
    
    return (
        <div className="page">
            <form className="form_template" onSubmit={(e)=>handleSubmit(e)}>
                <TagFormText text={props.text}/>
                <TagFormButton />
            </form>
        </div>
    );
}