export default function Title(props){
    return(
        <div className="banner">
            <span style={{flex: 1}}></span>
            <h1 style={{ color: '#DDDDDD', flex: 3, fontSize: '25px', textShadow: '0 0 2px black' }}>fake <span style={{color:'white', fontWeight:'normal'}}>stack</span><span style={{color:'black', textShadow: '0 0 0px black'}}>Overflow</span></h1>
            <span style={{flex: 1}}></span>
        </div>
    );
}