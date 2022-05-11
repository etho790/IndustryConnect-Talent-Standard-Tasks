import React from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json';
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {



            showEditSection: false,
            Address: props.addressData,      //props.addressData is asigned to a var that can be changed in state
           
            updateProfileData: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfileData: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state
        }


        this.renderEdit = this.renderEdit.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
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


    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()      
            )
    }
    saveContact() {/*
        //copies this.state.linkedAccounts into data var
        const data = Object.assign({}, this.state.linkedAccounts)
        //Calls the saveprofiledata function passed in as props in the accountProfile jsx
        //the saveprofiledata calls a function that takes 1 argument. and the argument passed in data
        this.props.saveProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK
        //close edit
        this.closeEdit()*/
    }
    handleChange(event) {
        /*
        //copies this.state.linkedAccounts into data var
        const data = Object.assign({}, this.state.linkedAccounts)
        //modifies the value of the specific property in the data array
        data[event.target.name] = event.target.value
        this.setState({
            //sets the state and modifies the linkedaccount var in state
            linkedAccounts: data
        })
        */
    }

    renderDisplay() {
        /*
        let Address = `${this.state.Address.number} ${this.state.Address.street}${this.state.Address.suburb}`
        let City = this.state.Address.city
        let Country = this.state.Address.country
       */


        //state.Address is undefined even though it receives the correct variable do to it being an ASNYC CALL 
        //FIX THIS!!!!!!!!!!!!!!!!!
        console.log("this is the address", this.state.Address)
        return (
            <div> 
                
            {/*
            <div className="ui sixteen wide column">
            <React.Fragment>
                <p>Address: {Address}</p>
                <p>City: {City}</p>
                <p>Country: {Country}</p>
            </React.Fragment>
            <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
            */}
                          
            </div>
        )
    }
   
    renderEdit() {

        //WHAT IT LOOKS LIKE ONCE YOU PRESS EDIT

        return (
            <div className='ui sixteen wide column'>
                <div className="ui equal width grid">
                 <ChildSingleInput
                    inputType="text"
                    label="Number"
                    name="Number"
                    value={this.state.Address.number}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Street Number"
                    errorMessage="Please enter your Street Number"
                    />
                </div>
                <div className="eight wide column">
                <ChildSingleInput
                    inputType="text"
                    label="Street"
                    name="Street"
                    value={this.state.Address.street}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Street"
                    errorMessage="Please enter your Street"
                    />
                </div>
                <div className="column">
                <ChildSingleInput
                    inputType="text"
                    label="Suburb"
                    name="Suburb"
                    value={this.state.Address.suburb}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Suburb"
                    errorMessage="Please enter your Suburb"
                    />
                </div>
            </div>
            /*
            <div className="ui equal width grid">
                <ChildSingleInput
                    inputType="text"
                    label="Country"
                    name="Country"
                    value={this.state.linkedAccounts.github}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your Github url"
                    errorMessage="Please enter your github url"
                />
                <ChildSingleInput
                    inputType="text"
                    label="Email address"
                    name="email"
                    value={this.state.newContact.email}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter an email"
                    errorMessage="Please enter a valid email"
                />

                <ChildSingleInput
                    inputType="text"
                    label="Phone number"
                    name="phone"
                    value={this.state.newContact.phone}
                    controlFunc={this.handleChange}
                    maxLength={12}
                    placeholder="Enter a phone number"
                    errorMessage="Please enter a valid phone number"
                />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>

               */
            
        )
    }


}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
       
    }

    
    render() {

        
    }
}