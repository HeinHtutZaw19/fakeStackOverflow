import Banner from "./banner.js"
import MainPage from "./mainpage.js";
import React, { Component } from 'react';

import axios from 'axios';
axios.defaults.withCredentials = true

export default class FakeStackOverflow extends Component {
    constructor(props) {
        super(props);
        this.flag = false;
        this.state = {
            orderedQuestions: { display: "All Questions", order: "newest", questions: [{ _id: 'default', title: 'default', tags: [{ name: 'default' }], answers: [{ text: 'default', comments:[]}], ask_date_time: Date.now(), comments: [], asked_by:''}] },
            page: { to: 'welcome_page', from: 'welcome_page' },
            user: {user: 'default', role: 'guest', reputation: '0', createdAt: new Date()},
            loggedin: 'default',
            users: [{user: 'default', role: 'guest', reputation: '0', createdAt: new Date()}],
            searchedQuestions: [],
            availableTags: [],
            reputation: 0,
        };
        this.handleSearchKeyword = this.handleSearchKeyword.bind(this);
        this.handleLogOut = this.handleLogOut.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleReturnToAdminProfile = this.handleReturnToAdminProfile.bind(this);
        this.handleUserDelete = this.handleUserDelete.bind(this);
    }

    componentDidMount() {
        axios.get('http://127.0.0.1:8000/', { withCredentials: true })
            .then(res=>{
                if(res.data!=="Session Not Found"){
                    this.setState({user:{user:res.data.email, role:res.data.isAdmin?"admin":"registered", reputation: res.data.reputation, createdAt: res.data.createdAt},page:{to:'question_page',from:this.state.page.to}});
                    this.setState({reputation: res.data.reputation})
                }
            })
            .catch(err=>{
                console.log(err);
            })
        axios.get('http://127.0.0.1:8000/question/newest', { withCredentials: true })
            .then(res => {
                this.setState({ orderedQuestions: { display: "All Questions", order: "newest", questions: res.data } });
                console.log(res.data)
                this.flag = true
            })
            .catch(err=>{
                console.log(err)
            })       
        axios.get('http://127.0.0.1:8000/tags', { withCredentials: true })
        .then(async (tagsRes) => {
            const tags = tagsRes.data;
            const tagArray = [];

            for (let tag of tags) {
                try {
                    let tagRes = await axios.post('http://127.0.0.1:8000/search/tags/', { tags: [tag.name] }, { withCredentials: true });
                    let questions = tagRes.data;
                    tagArray.push({ tag: tag, question: questions });
                } catch (err) {
                    console.log(err);
                }
            }
            this.setState({ availableTags: tagArray });
        })
        .catch(err => {
            console.log(err);
        });
}

    handleSearchKeyword(e) {
        if(e.key==='Enter'){
            e.preventDefault()
            var questions = []
            let keyWords = e.target.value.toLowerCase().split(' ');
            let keyTags = keyWords.filter(key => key[0]==='[' && key[key.length-1]===']');
            keyWords = keyWords.filter(key => !keyTags.includes(key))
            keyTags = keyTags.map((key)=>key.substring(1,key.length-1));
            if(keyTags.length>0){
                axios.post('http://127.0.0.1:8000/search/tags/',{tags:keyTags}, { withCredentials: true }).then(res=>{
                    questions = questions.concat(res.data);
                    const uniqueQuestions = Array.from(
                        questions
                        .reduce((map, question) => map.set(question._id, question), new Map())
                        .values()
                    );
                    questions = uniqueQuestions.sort((a,b)=>new Date(b.ask_date_time) - new Date(a.ask_date_time));
                    this.setState({ orderedQuestions: { display: "Search Questions", order: "newest", questions: questions } });
                    this.setState({page: {to:"question_page",from:"search"}});
                    this.setState({searchedQuestions: questions})
                }).catch(err=>{
                    console.error(err);
                })
            }
            if(keyWords.length>0){
                axios.post('http://127.0.0.1:8000/search/words/',{words:keyWords}, { withCredentials: true }).then(res=>{
                    questions = questions.concat(res.data);
                    const uniqueQuestions = Array.from(
                        questions
                        .reduce((map, question) => map.set(question._id, question), new Map())
                        .values()
                    );
                    questions = uniqueQuestions.sort((a,b)=>new Date(b.ask_date_time) - new Date(a.ask_date_time));
                    this.setState({ orderedQuestions: { display: "Search Questions", order: "newest", questions: questions } });
                    this.setState({page: {to:"question_page",from:"search"} });
                    this.setState({searchedQuestions: questions})
                }).catch(err=>{
                    console.error(err);    
                })
            }
            
            
        }
    }
    async handlePageChange(pg,fr,opt=null){
        if(pg!==fr){
            document.getElementsByClassName('page')[0].style.display='none';
        }
        if(fr.includes('profile') && !pg.includes('profile')){
            axios.get('http://127.0.0.1:8000/find/user/'+this.state.loggedin, { withCredentials: true })
            .then(res => {
                this.setState({user:{user:res.data.email, role:res.data.isAdmin?"admin":"registered", createdAt: res.data.createdAt}})
                this.setState({reputation:res.data.reputation})
            })
            .catch(err=>{
                console.log(err)
            })  
        }
        if(pg==='question_page'){
            axios.get('http://127.0.0.1:8000/question/newest', { withCredentials: true })
            .then(res => {
                this.setState({orderedQuestions:{display:'All Questions', order:'newest', questions: res.data}});
            })
            .catch(err=>{
                console.log(err)
            })    
        }
        else if(pg==='tags_page'){
            try {
                let tagsRes = await axios.get('http://127.0.0.1:8000/tags', { withCredentials: true });
                let tags = tagsRes.data;
                const tagArray = []
        
                for (let tag of tags) {
                    try {
                        let tagRes = await axios.post('http://127.0.0.1:8000/search/tags/',{tags:[tag.name]}, { withCredentials: true });
                        let questions = tagRes.data;
                        tagArray.push({ tag: tag, question: questions });
                    } catch (err) {
                        console.log(err);
                    }
                }
                this.setState({availableTags:tagArray});
            } catch (err) {
                console.log(err);
            }
        }
        else if(pg==='profile_question_page'){
            
            // let res = await axios.get('http://127.0.0.1:8000/find/user/'+this.state.user.user);
            // this.setState({user:{user:res.data.email, role:res.data.isAdmin?"admin":"registered", createdAt: res.data.createdAt}})
            // this.setState({reputation:res.data.reputation})
            let questions = []
            if(opt){
                questions = await axios.get('http://127.0.0.1:8000/find/'+opt+'/question', {withCredentials: true });
                // let res = await axios.get('http://127.0.0.1:8000/find/user/'+opt);
                // this.setState({user:{user:res.data.email, role:res.data.isAdmin?"admin":"registered", createdAt: res.data.createdAt}})
                // this.setState({reputation:res.data.reputation})
            }
            else{
                questions = await axios.get('http://127.0.0.1:8000/find/'+this.state.user.user+'/question', { withCredentials: true });
            }
            this.setState({orderedQuestions:{display:this.state.orderedQuestions.display, order:'newest', questions: questions.data}});
        
        }
        else if(pg==='profile_answer_page'){
            let questions = await axios.get('http://127.0.0.1:8000/find/'+this.state.user.user+'/answer', { withCredentials: true });
            this.setState({orderedQuestions:{display:this.state.orderedQuestions.display, order:'newest', questions: questions.data}});
        }
        else if(pg==='profile_tag_page'){
            let tagsRes = await axios.get('http://127.0.0.1:8000/find/'+this.state.user.user+'/tag', { withCredentials: true });
            let tags = tagsRes.data;
            const tagArray = []
    
            for (let tag of tags) {
                try {
                    let tagRes = await axios.post('http://127.0.0.1:8000/search/tags/',{tags:[tag.name]}, { withCredentials: true });
                    let questions = tagRes.data;
                    tagArray.push({ tag: tag, question: questions });
                } catch (err) {
                    console.log(err);
                }
            }
            this.setState({availableTags:tagArray});
        }
        else if(pg==='profile_users_page'){
            let usersData = await axios.get('http://127.0.0.1:8000/users/'+this.state.loggedin, { withCredentials: true });
            this.setState({users: usersData.data});
        }
        this.setState({ page: { to: pg, from: fr } });
    }

    handleLogOut(){
      this.setState({page:{to:'welcome_page', from:'question_page'}});
      this.setState({user:{user:'default', role: 'guest', reputation: '0', createdAt: new Date()}});
      axios.post('http://127.0.0.1:8000/logout', { withCredentials: true }).then(res=>{
          console.log(res);
      })
    }
  
    handleReturnToAdminProfile(){
        axios.get('http://127.0.0.1:8000/find/user/'+this.state.loggedin, { withCredentials: true }).then(res=>{
            this.setState({user:{user:res.data.email, role: res.data.isAdmin?"admin":"registered", createdAt: res.data.createdAt}});
            this.setState({page: {to:"profile_users_page",from:this.state.page.to}});
            this.setState({reputation:res.data.reputation})
        })
    }

    handleUserDelete(email){
        axios.get('http://127.0.0.1:8000/delete/user/'+email, { withCredentials: true }).then(async(res)=>{
            if(res.status===200){
                let usersData = await axios.get('http://127.0.0.1:8000/users/'+this.state.loggedin, {withCredentials: true});
                this.setState({users: usersData.data});
            }
        })
    }

    

    render() {
        // if(this.flag===false) 
        //     return (<h3>Wait</h3>);
        return (
            <section className="fakeso">
                {
                  (this.state.page.to!='welcome_page' && this.state.page.to!='create_account_page' && this.state.page.to!='login_page') &&
                  <Banner role={this.state.user.role} handleOnLinkClicked={this.handlePageChange} page={this.state.page} handleSearchKeyword={this.handleSearchKeyword} handleLogOut={this.handleLogOut}/>
                }
                <MainPage reputation={this.state.reputation} changeReputation={(t)=>this.setState({reputation:t})} handleUserDelete={this.handleUserDelete} handleReturnToAdminProfile={this.handleReturnToAdminProfile} isAdmin={this.state.user.role==='admin' || this.state.loggedin!==this.state.user.user} loggedin={this.state.loggedin} changeLoggedIn={(id)=>{this.setState({loggedin: id})}} users={this.state.users} user={this.state.user} changeAvailableTags={(tags)=>this.setState({availableTags: tags})} availableTags={this.state.availableTags} handlePageChange={this.handlePageChange} searchedQuestions={this.state.searchedQuestions} changeUser={(u,r,d)=>this.setState({user:{user:u, role:r, createdAt: d}})} orderedQuestions={this.state.orderedQuestions} changeOrder={(di, ord, q) => this.setState({ orderedQuestions: { display: di, order: ord, questions: q } })} changePage={(t, f) => this.setState({ page: { to: t, from: f } })} page={this.state.page} /> 
            </section>
        );
    }
} 