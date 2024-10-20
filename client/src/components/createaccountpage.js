import React, { Component } from 'react';
import Title from "./title.js";
import RegistrationForm from "./registrationform.js";

export default class CreateAccountPage extends Component{
    constructor(props){
        super(props)
    }
    render() {
        return(
            <div className="page" id="create_account_page">
                <Title></Title>
                <RegistrationForm changePage={this.props.changePage}></RegistrationForm>
            </div>
        )
    }
}