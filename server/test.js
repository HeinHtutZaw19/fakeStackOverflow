import axios from 'axios'

async function test(){
    let res = await axios.get('http://127.0.0.1:8000/test', { withCredentials: true })
}

for(let i = 0;i<5;i++){
    test();
}