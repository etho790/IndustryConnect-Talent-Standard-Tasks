import React, { Component } from "react";
import Cookies from 'js-cookie';
import { Form } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Location } from '../Employer/CreateJob/Location.jsx';
export class IndividualDetailSection extends Component {
    constructor(props) {
        super(props)
        
        // if props.details is true (not null) return (or execute) Object.assign({}, props.details) & details = it
        // otherwise make details = the empty strings for each property in the brackets below 
        const dets = props.details ?
            Object.assign({}, props.details) :{
                firstName: "",
                lastName: "",
                email: "",
                phone: ""
            }


        this.state = {            
            showEditSection: false,
            newContact: dets,//NOTE: the best way to know for sure as to what you're accessing in state is
                            //to console.log to see if we are accessing the properties correctly

            //not used
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData    //props.saveProfileData is asigned to a var that can be changed in state

        }

        


        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveDetails = this.saveDetails.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
       
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

    handleChange(event, { name, value }) {
        //copies this.state.newContact.details into data var
        const data = Object.assign({}, this.state.newContact)        

        //modifies the value of the specific property in the data array
        data[name] = value

        //This is how you set properties of an object in state.
        this.setState({
            //sets the state and UPDATES the newContact var in state
            newContact: data
        })
    
    }

    saveDetails() {
       //copies this.state.newContact into data var
        const data = Object.assign({}, this.state.newContact)
        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        this.state.updateProfile(data)  //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK
         //close edit
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }


    renderEdit() {

      //THE VALUE ATTRIBUTE IS USELESS, DISCARD IT
        return (
            <div className='ui sixteen wide column'>
                <Form.Input
                    name="firstName"
                    label="First Name"    
                    onChange={this.handleChange}                    
                    placeholder="Enter your first name"                    
                />

                <Form.Input
                    name="lastName"
                    label="Last Name"             
                    onChange={this.handleChange}                
                    placeholder="Enter your last name"                
                />

                <Form.Input
                    name="email"
                    label="Email address"
                    onChange={this.handleChange}                   
                    placeholder="Enter an email"                    
                />

                <Form.Input
                    name="phone"
                    type="number"
                    label="Phone number"
                    onChange={this.handleChange}                    
                    placeholder="Enter a phone number"                    
                />
                
                <button type="button" className="ui teal button" onClick={this.saveDetails}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay(){
      

        let fullName = this.props.details ? `${this.props.details.firstName} ${this.props.details.lastName}` : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""        

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {fullName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}


export class CompanyDetailSection extends Component {
    constructor(props) {
        super(props)

        const details = props.details ?
            Object.assign({}, props.details)
            : {
                name: "",
                email: "",
                phone: ""
            }

        this.state = {
            showEditSection: false,
            newContact: details
        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveContact = this.saveContact.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
    }

    openEdit() {
        const details = Object.assign({}, this.props.details)
        this.setState({
            showEditSection: true,
            newContact: details
        })
    }

    closeEdit() {
        this.setState({
            showEditSection: false
        })
    }

    handleChange(event) {
        const data = Object.assign({}, this.state.newContact)
        data[event.target.name] = event.target.value
        this.setState({
            newContact: data
        })
    }

    saveContact() {
        const data = Object.assign({}, this.state.newContact)
        this.props.controlFunc(this.props.componentId, data)
        this.closeEdit()
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {
        

        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="Name"
                    name="name"
                    value={this.state.newContact.name}
                    controlFunc={this.handleChange}
                    maxLength={80}
                    placeholder="Enter your last name"
                    errorMessage="Please enter a valid name"
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
                Location:
                <Location location={location} handleChange={this.handleChange} />
                <button type="button" className="ui teal button" onClick={this.saveContact}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
            </div>
        )
    }

    renderDisplay() {

        let companyName = this.props.details ? this.props.details.name : ""
        let email = this.props.details ? this.props.details.email : ""
        let phone = this.props.details ? this.props.details.phone : ""
        let location = {city:'',country:''}
        if (this.props.details && this.props.details.location) {
            location = this.props.details.location
        }

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Name: {companyName}</p>
                        <p>Email: {email}</p>
                        <p>Phone: {phone}</p>
                        <p> Location: {location.city}, {location.country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
}
