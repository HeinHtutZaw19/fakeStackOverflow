import axios from 'axios';
import {useState} from 'react'
axios.defaults.withCredentials = true
export default function RegistrationForm(props){
    const [err,setErr] = useState("");

    const handleSubmit = (e)=>{
        e.preventDefault()
        let data = new FormData(e.target);
        const emailPattern = new RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
        if (!emailPattern.test(data.get('email'))) {
            setErr("Email Invalid");
            return;
        }
        if(data.get('pw_verify')!==data.get('pw')){
            setErr("Passwords do not match");
            return
        }

        if(data.get('pw').search(new RegExp(data.get('firstname'), 'i')) !== -1 || 
            data.get('pw').search(new RegExp(data.get('secondname'), 'i')) !== -1 || 
            data.get('pw').search(new RegExp(data.get('email').split('@')[0], 'i')) !== -1){
            setErr("Passwords cannot contain first or last name or email id");
            return;
        }
        axios.post('http://127.0.0.1:8000/register', 
            {
                username: data.get('firstname') + data.get('secondname'),
                email: data.get('email'),
                pw: data.get('pw')
            }, { withCredentials: true }).then(res=>{
                if(res.data==="DUPLICATE"){
                    setErr("User with the same email exists")
                }
                else{
                    props.changePage('login_page', 'create_account_page')
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
            <p> <strong>First Name</strong></p>
            <input
                type="text"  
                name="firstname" 
                placeholder="Enter first name here" 
                required
            />
            <p> <strong>Second Name</strong></p>
            <input
                type="text"  
                name="secondname" 
                placeholder="Enter second name here" 
                required
            />
            <p> <strong>Password</strong></p>
            <input
                type="password"  
                name="pw" 
                id="pw"
                placeholder="Enter password here" 
                required
            />
            <p> <strong>Confirm Password</strong></p>
            <input
                type="password"  
                name="pw_verify" 
                placeholder="Verify password here" 
                required
            />
            <input 
                type="submit"
                style={{margin:"3% 0"}} 
                className="blue_button" 
                value= "Register"
            />     
            <p className="error">{err}</p>
        </form>
    )
}