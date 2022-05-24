/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { Form, TextArea, List } from 'semantic-ui-react'
export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);

        // if props.summaryData is true (not null) return (or execute) Object.assign({}, props.summaryData) & Dets = it
        // otherwise make Dets = the empty strings for each property in the brackets below
        const Dets = props.summaryData ?
            Object.assign({}, props.summaryData) : {
                summary: '',
                description: '',
            }


        this.state = {
            SelfDescription: Dets,

            //not used
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }

        this.handleChange = this.handleChange.bind(this);
        this.saveSummary = this.saveSummary.bind(this);

       
    };

   
    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label) we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    handleChange(event, { name, value }) {
        //copies this.state.SelfDescription into data var
        const data = Object.assign({}, this.state.SelfDescription)
        //modifies the value of the specific property in the data array
        data[name] = value
        this.setState({
            //sets the state and modifies the SelfDescription var in state
            SelfDescription: data
        })
        console.log(data)
    }

    saveSummary() {
        //copies this.state.SelfDescription into data var
        const data = Object.assign({}, this.state.SelfDescription)

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        this.props.updateProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK
    }



    render() {
        return (
            <div className='ui sixteen wide column'>
                
                <Form.Input
                    name='summary'
                 placeholder="Please provide a short summary about yourself"                        
                 onChange={this.handleChange}
                 />               
                
                <List>
                    <List.Item>Summary must be no more than 150 characters.</List.Item>
                </List>

                <TextArea
                    placeholder='Please tell us about any hobbies,additional expertise or anything else you would like to add.'
                    name='description'
                    value={this.state.SelfDescription.description}
                    onChange={this.handleChange}
                    minLength={150}
                    maxLength={600}
                />
                <List>
                    <List.Item>Description must be between 150-600 characters.</List.Item>
                </List>
                <button style={{ marginTop: '1rem' }} type="button" className="ui teal right floated button" onClick={this.saveSummary}>Save</button>
            </div>
        )

    }
}



