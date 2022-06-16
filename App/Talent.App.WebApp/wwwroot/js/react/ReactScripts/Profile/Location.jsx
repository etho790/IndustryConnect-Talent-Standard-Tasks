import React from 'react'
import Cookies from 'js-cookie'
import { Dropdown, Form } from 'semantic-ui-react'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export class Address extends React.Component {
    constructor(props) {
        super(props)

        // if props.addressData is true (not null) return (or execute) Object.assign({}, props.addressData) & details = it
        // otherwise make details = the empty strings for each property in the brackets below 
        const details = props.addressData ?
            Object.assign({}, props.addressData) : {
                city: "",
                country: "",
                number: "",
                street: "",
                suburb: "",
                postCode: 0
            }
            //unfortunately it's bad practice to set props in a state in the constructor
            //and as a result we get errors saying that the variables with the props data are undefined, 
            //This is mainly because the GET function is an async function so we dont know when it gets the data
            // as a result the code above us is important to put it in our state as a failsafe

        var Countrydata = require('../../../../util/jsonFiles/countries.json')
        this.state = {
            CData: Countrydata,
            showEditSection: false,            
            Address: details,      //details is asigned to a var that can be changed in state

            //not used
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
        
        //copies this.state.Address into data var
        const data = Object.assign({}, this.state.Address)

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        //this.props.updateProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK
        
        //close edit
        this.closeEdit()
    }

     // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event, { name, value } ) {
        //Constantly at run time copies this.state.Address into data var
        const data = Object.assign({}, this.state.Address)
        console.log(name, value);
        //Constantly at run time modifies the value of the specific property in the data array
        data[name] = value
        this.setState({
            //sets the state and UPDATES the Address var in state
            Address: data
        })        
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderDisplay() {
        
        let Address = `${this.state.Address.number} ${this.state.Address.street}${this.state.Address.suburb}`
        let City = this.state.Address.city
        let Country = this.state.Address.country
       
              

        return (
            <div className='row'>
                <div className="ui sixteen wide column">
                    <React.Fragment>
                        <p>Address: {Address}</p>
                        <p>City: {City}</p>
                        <p>Country: {Country}</p>
                    </React.Fragment>
                    <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
                </div>
            </div>
        )
    }
    


    renderEdit() {        

        var Country = []
        var City = []

        //selectedCountry is set to be the value of this.state.Address.country, which ends up getting
        //filled the minute you click on a country option in the dropdown box. This is via the Handlechange func
        //called via the onchange tag, which updates the variables in the state. which means this.state.Address.country
        //is updated via the Handlechange func. It is important to note the the value tag for the dropdown box is useless
        //it might as well be null and it wouldnt matter.
        const selectedCountry = this.state.Address.country 
        const selectedCity =  this.state.Address.city 
                
        
        Country = Object.keys(this.state.CData).map((index) => ({
            key: index,     
            value: index,
            text: index,
        }))

        
        if (selectedCountry != "" && selectedCountry != null) {
            //The condition above is put in, MAINLY due to the error we would receive of the kind
            //Cannot read properties of undefined (reading 'map')
            //whenever we get this error, it is most likely due to the passed down prop that 
            //has not been filled yet due to the async call.
            City = (this.state.CData[selectedCountry]).map((cities,index) => ({
                key: index,
                value: cities,
                text: cities,
            }))
        }
        
        //WHAT IT LOOKS LIKE ONCE YOU PRESS EDIT       
        return (
            <div className="ui grid">
                <div className='row'>
                    <div className="four wide column">
                        <Form.Input                            
                            name="number"
                            label='Number'
                            value={this.state.Address.number}//just shows the current value of the state var being updated as you type
                            onChange={this.handleChange} // handles the selected options & saves it after clicking
                            placeholder="Enter your Street Number"                            
                            />
                    </div>
                    <div className="eight wide column">
                        <Form.Input
                            name="street"
                            label="Street"                            
                            value={this.state.Address.street}//just shows the current value of the state var being updated as you type
                            onChange={this.handleChange} // handles the selected options & saves it after clicking 
                            placeholder="Enter your Street"
                            
                            />
                    </div>
                    <div className="four wide column">
                        <Form.Input
                            name="suburb"
                            label="Suburb"                            
                            value={this.state.Address.suburb}//just shows the current value of the state var being updated as you type
                            onChange={this.handleChange} // handles the selected options & saves it after clicking
                            placeholder="Enter your Suburb"
                            
                            />
                    </div>
                
                </div>

                
                <div className='row'>
                    <div className="six wide column">                      
                        <label>Country</label>
                        <Dropdown
                           placeholder='Select a Country'
                           label="country"
                           fluid
                           selection
                           name="country"
                           options={Country}
                            value={selectedCountry}  //just shows the current value of the state var being updated when you select
                           onChange={this.handleChange}    // handles the selected options & saves it after clicking
                           />
                    </div> 
                            

                    <div className="six wide column">
                        <label>City</label>
                        <Dropdown
                            placeholder='Select a City'    
                            label="city"
                            fluid
                            selection
                            name="city"
                            options={City}                            
                            value={selectedCity}   //just shows the current value of the state var being updated when you select
                            onChange={this.handleChange}    // handles the selected options & saves it after clicking
                        />
                    </div>

                    <div className="four wide column">
                        <Form.Input
                            name="postCode"
                            label="Post Code"
                            value={this.state.Address.postCode}//just shows the current value of the state var being updated as you type
                            onChange={this.handleChange} // handles the selected options & saves it after clicking
                            placeholder="Post Code"
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='six wide column'>
                        <button type="button" className="ui teal button" onClick={this.saveDetails}>Save</button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                    </div>
                </div>
            </div>
        )
    }


}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)

        // if props.nationalityData is true (not null) return (or execute) Object.assign({}, props.nationalityData) & details = it
        // otherwise make details = the empty strings for each property in the brackets below 
        const details = props.nationalityData ?
            Object.assign({}, props.nationalityData) : {
                nationality: "",                
            }

        var Countrydata = require('../../../../util/jsonFiles/countries.json')
        this.state = {
            CData: Countrydata,
            showEditSection: false,
            Nationality: details,      //details is asigned to a var that can be changed in state
           

            //not used
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }
      
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.saveDetails = this.saveDetails.bind(this)
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

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    saveDetails() {
        
        //copies this.state.Nationality into data var
        const data = Object.assign({}, this.state.Nationality)

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        //this.props.updateProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK

        //close edit
        this.closeEdit()        
    }

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event, { name, value }) {
        //Constantly at run time copies this.state.Address into data var
        const data = Object.assign({}, this.state.Nationality)
        //Constantly at run time modifies the value of the specific property in the data array
        data[name] = value
        this.setState({
            //sets the state and UPDATES the Nationality var in state
            Nationality: data,
            
        })

        console.log(this.state.Nationality)

        //Saves the data too
        this.saveDetails();
    }


    renderDisplay() {
        //FIX THIS!!!!!
        var nationality = this.state.Nationality.toString()
    
        return (
            <div className='row'>
                <div className="ui eight wide column">
                    <React.Fragment>     
                            <div className="six wide column">                               
                                <Dropdown                               
                                    selection
                                    name="nationality"
                                    placeholder="Select your nationality"
                                    options={null}
                                    onClick={this.openEdit}    // the minute you click
                            />
                        </div>
                    </React.Fragment>                   
                </div>
                <div className="ui six wide column">
                    {<p>Selected Nationality:{nationality}</p> }
                </div>
            </div>
        )

    }


    renderEdit() {
        var Nationale = []

        // It is important to note the the value tag for the dropdown box is useless
        //it might as well be null and it wouldnt matter, as the actual value stored as you click on any option
        //it is automatically received via the handlechange func
        

        Nationale = Object.keys(this.state.CData).map((index) => ({
            key: index,
            value: index,
            text: index,
        }))

        

        return (
            <div className='row'>
                
                <div className="ui six wide column">
                    <React.Fragment>
                        <div className="six wide column">
                            <Dropdown
                                search                                
                                selection
                                options={Nationale}
                                placeholder="Select your nationality"                                
                                name="nationality"                                
                                onChange={this.handleChange}    // handles the selected options & saves it after clicking
                            />
                        </div>
                        
                       
                    </React.Fragment>
                </div>
            </div>
        )
    }
}