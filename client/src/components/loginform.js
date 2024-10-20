import axios from 'axios';
import {useState} from 'react'

axios.defaults.withCredentials = true
export default function LogInForm(props){
    const [err,setErr] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault()
        let data = new FormData(e.target);
        
        axios.post('http://127.0.0.1:8000/login', 
            {
                email: data.get('email'),
                pw: data.get('pw')
            }, { withCredentials: true }).then(res=>{
                if(typeof res.data==="object"){
                    props.changePage('question_page', 'login_page')
                    props.changeUser(data.get('email'), res.data['isAdmin']?'admin':'registered',res.data['createdAt']);
                    props.changeLoggedIn(data.get('email'));
                    props.changeReputation(res.data.reputation)
                }
                else{
                    setErr(res.data)
                }
             }
            )
    }

    return ( 
        <form className="flex_vertical" onSubmit={(e)=>handleSubmit(e)}>
            <p> <strong>Email</strong></p>
            <div>
                <input
                    type="text"  
                    name="email" 
                    placeholder="Enter mail here" 
                    required
                />
            </div>
            <p> <strong>Password</strong></p>
            <input
                type="password"  
                name="pw" 
                id="pw"
                placeholder="Enter password here" 
                required
            />
            <input 
                type="submit"
                style={{margin:"3% 0"}} 
                className="blue_button" 
                value= "Log In"
            />     
            <p className="error">{err}</p>
        </form>
    )
}