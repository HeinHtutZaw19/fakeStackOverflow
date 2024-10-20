export default function Banner(props){
    function handleQuestionLinkClicked(){
        props.handleOnLinkClicked('question_page',props.page.to);
    }
    function handleTagLinkClicked(){
        props.handleOnLinkClicked('tags_page',props.page.to);
    }
    function handleProfileLinkClicked(){
        props.handleOnLinkClicked('profile_question_page', props.page.to);
    }
    const questColor = (props.page.to==='question_page' || props.page.to==='answer_page')?'rgb(148, 185, 197)':'lightblue';
    const tagColor = (props.page.to==='tags_page')?'rgb(148, 185, 197)':'lightblue';
    const profileColor = (props.page.to.includes("profile"))?'rgb(148, 185, 197)':'lightblue';
    
	return (
        <div className="banner">
            
            <div style={{flex: 1, width: '100%', height: '100%'}}>
                <button className="catalog" style={{backgroundColor:questColor}} onClick={handleQuestionLinkClicked}>Questions</button>
            </div>
            <div style={{flex: 1, width: '100%', height: '100%'}}>
                <button className="catalog" style={{backgroundColor:tagColor}}onClick={handleTagLinkClicked}>Tags</button>   
            </div>
            <div style={{flex: 1, width: '100%', height: '100%', backgroundColor: profileColor}}>
                {
                    props.role!='guest'&&
                    <button className="catalog" style={{width: 'auto',backgroundColor:profileColor}} onClick={props.role==='admin'? ()=>props.handleOnLinkClicked('profile_users_page', props.page.to):handleProfileLinkClicked}>Profile</button>
                }
            </div>
            
            <h1 style={{ color: '#DDDDDD', flex: 3, fontSize: '25px', textShadow: '0 0 2px black' }}>fake <span style={{color:'white', fontWeight:'normal'}}>stack</span><span style={{color:'black', textShadow: '0 0 0px black'}}>Overflow</span></h1>
            <form style = {{flex: 2}}>
                <input style={{width: '75%'}} type="text" placeholder="Search..." id="search_info" name="search_info" className="searchbar" onKeyPress={props.handleSearchKeyword}></input>
            </form>
            <div style={{flex: 1}}>
                <button className="catalog" style={{backgroundColor:'lightblue'}} onClick={()=>props.handleLogOut()}> Log Out </button>
            </div>
        </div>
    );
}
