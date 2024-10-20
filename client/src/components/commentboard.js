

import Comment from './comment.js'

import {useState} from 'react'


export default function CommentBoard(props){
    const [err,setErr] = useState({flag:false, text:''});
    function handleSubmit(e){
        e.preventDefault();
        let data = new FormData(e.target);
        const commentInput = e.target.elements.comment;
        if (commentInput.value.length > 140) {
            setErr({flag:true,text:'Comment must be shorter than 140 chars.'});
            return;
        }
        else if(props.reputation<50){
            setErr({flag:true,text:'Must have at least 50 reputation pts to comment.'});
            return;
        }
        else{
            setErr({flag:false,text:''});
        }
        props.insertComment(props.id, props.mode, data.get('comment'))
        e.target.elements.comment.value = '';

    }
    const cmtElements = [];
    //State for the 5 comments to be shown
    const [idx,setIdx] = useState(0);
    let i = (props.comments.length==idx) ? 0 : idx;
    let initial = i
    while(i<initial+3) {
        if(i>=props.comments.length){
            break;
        }
        let c = props.comments[i]
        cmtElements.push(
            <Comment
                key={c._id.toString()}
                id = {c._id}
                text={c.text}
                cmt_by={c.cmt_by}
                votes={c.votes}
                cmtMetaData={props.getMetaData(c.cmt_date_time, "commented")}
                handleVote={props.handleVote}
            />);
        i++;
    }
    return (
        <div>
            <div>
                <form className="flex_horizontal" style={{ display: 'flex', padding: '0% 1%', alignItems: 'center', width: '60%'}} onSubmit={(e) => handleSubmit(e)}>
                    <p style={{flex:2, marginLeft:'3%'}}>{props.comments.length} {props.comments.length > 1 ? "comments" : "comment"}</p>
                    <div style={{flex:2, marginRight:'2%'}} className="flex_vertical">
                        <input
                            type="text"
                            name="comment"
                            size={70}
                            placeholder='Enter comment here'
                            required
                        />
                        {
                            err.flag &&
                            <p className="error"> {err.text} </p>
                        }
                        {
                            !err.flag &&
                            <br></br>
                        }
                    </div>
                    {idx >= 3 && props.comments.length !== idx &&
                        <div style={{flex:1}}>
                            <p className="grey_button"  onClick={(e) => { e.preventDefault(); setIdx(Math.max(i - 10, 0)) }}> Prev </p>
                        </div>
                    }
                    {!(idx >= 3 && props.comments.length !== idx) &&
                        
                        <span style={{flex:1}}></span>
                    }
                    <p style={{flex:1,color:'grey'}}>
                        {'Page '} <span style={{color:'orange'}}>{Math.ceil(i/3)}</span>
                    </p>
                    <div style={{flex:1}}>
                        <p className="grey_button"   onClick={(e) => { e.preventDefault(); setIdx(i) }}> Next </p>
                    </div>
                </form>
            </div>

            <div>
                {cmtElements}
            </div>
        </div>
    );
}