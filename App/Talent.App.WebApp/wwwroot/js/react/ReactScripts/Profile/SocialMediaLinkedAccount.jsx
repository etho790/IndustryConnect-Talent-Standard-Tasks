/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup, Container, Button, Icon } from 'semantic-ui-react';



export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);       

        this.state = {
            //IN THE STATE, YOU CREATE VARIABLES THAT CAN ONLY BE AFFECTED IN THE STATE, SO TO CHANGE THEM
            //OUTSIDE OF THE CONSTRUCTOR YOU MUST USE SET.STATE 
            showEditSection: false,           
            linkedAccs: props.linkedAccounts,      //props.linkedAccounts is asigned to a var that can be changed in state
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state
        }


        this.renderEdit = this.renderEdit.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveDetails = this.saveDetails.bind(this)
    }

    componentDidMount() {
        $('.ui.button.social-media')
            .popup();
    }

    openEdit() {
      
        this.setState({
            showEditSection: true,           

        })
        
    }
    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    saveDetails() {
        //copies this.state.linkedAccounts into data var
        const data = Object.assign({}, this.state.linkedAccs)
        //Calls the saveprofiledata function passed in as props in the accountProfile jsx
        //the saveprofiledata calls a function that takes 1 argument. and the argument passed in data
        //this.props.saveProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK
        //close edit
        this.closeEdit()
    }
     // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event) {
        
        //Constantly at run time copies this.state.linkedAccounts into data var
        const data = Object.assign({}, this.state.linkedAccs)
        //modifies the value of the specific property in the data array
        data[event.target.name] = event.target.value

        //Constantly at run time updates the specific properties in the intended state variable
        this.setState({
            //sets the state and modifies the linkedaccount var in state
            linkedAccs: data
        })
        
    }

    render(){
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay(){
        var FirstButton = {
            width: 150,
               
        }
        var SecondButton = {
            width: 150,
               
        }        

        return (
            <div className="ui sixteen wide column">
                <div className="ui left floated primary button" style={FirstButton}>                  
                   <Icon name='linkedin'/>
                    Linkedin                    
                </div>
                <div className="ui left floated secondary button" style={SecondButton}>               
                    <Icon name='github'/>
                        Github                  
                </div>

                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
               
            </div>
            )
    }


    renderEdit(){
        //WHAT IT LOOKS LIKE ONCE YOU PRESS EDIT

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Linkedin"
                    name="linkedIn"
                    value={this.state.linkedAccs.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Linkedin url"
                    errorMessage="Please enter your Linkedin url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Github"
                    name="github"
                    value={this.state.linkedAccs.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Github url"
                    errorMessage="Please enter your github url"
                />
                <button type="button" className="ui teal button" onClick={this.saveDetails}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
        </div>
        )
    }
}

