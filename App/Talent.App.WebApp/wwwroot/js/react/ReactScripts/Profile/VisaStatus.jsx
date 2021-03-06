import React from 'react'
import { Dropdown, Form, Grid  } from 'semantic-ui-react'
import { SingleInput } from '../Form/SingleInput.jsx';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)

        // if props.visaStatus is true (not null) return (or execute) Object.assign({}, props.visaStatus) & VisaState = it
        // otherwise make VisaState = the empty strings for each property in the brackets below
        const VisaState = props.visaStatus ?
            Object.assign({}, props.visaStatus) : {
                visaStatus: '',
                visaExpiryDate: '',
            }
       


        this.state = {           
            showEditSection: false,
            VisaInfo: VisaState,      //details is asigned to a var that can be changed in state
           
             saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }

        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
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

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event, { name, value }) {
        //Constantly at run time copies this.state.VisaInfo into data var
        const data = Object.assign({}, this.state.VisaInfo)
        //modifies the value of the specific property in the data array
        data[name] = value

        this.setState({
            //Constantly at run time sets the state and UPDATES the Nationality var in state
            VisaInfo: data
        })             
    }


    saveDetails() {
        //copies this.state.VisaInfo into data var
        const data = Object.assign({}, this.state.VisaInfo)

        //Calls the saveProfileData function passed in as props in the accountProfile jsx
        //the saveProfileData calls a function that takes 1 argument. and the argument passed in data
        this.state.saveProfile(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK

        //close edit
        this.closeEdit()
    }

    render() {
        return (        
            this.renderEdit()
        )
    }


    

    renderEdit() {
        var VisaType = [        
            {
                key: 'Citizen',
                text: 'Citizen',
                value: 'Citizen',              
            }, 
            {
                key: 'Permanent Resident',
                text: 'Permanent Resident',
                value: 'Permanent Resident',
            },
            {
                key:   'Work Visa',
                text:  'Work Visa',
                value: 'Work Visa',
            },
            {
                key:   'Student Visa',
                text:  'Student Visa',
                value: 'Student Visa',
            }
        ]

        var ElementToRender = null;
        if (this.state.VisaInfo.visaStatus == "Citizen" || this.state.VisaInfo.visaStatus == "Permanent Resident") {
            ElementToRender = <React.Fragment>
                                    <Grid.Column width ={6} >
                    
                                    </Grid.Column >

                                    <Grid.Column width={4}>
                    <button style={{ marginTop: '1.5rem' }} type="button" className="ui right floated teal button" onClick={this.saveDetails}>Save</button>
                                    </Grid.Column>
                                </React.Fragment>

        }
        else if (this.state.VisaInfo.visaStatus == "Work Visa" || this.state.VisaInfo.visaStatus == "Student Visa") {
            ElementToRender = <React.Fragment>
                                     <Grid.Column width={6} >
                                        Visa Expiry
                                        <Form.Input
                                            name="visaExpiryDate"
                                            type="date"                                    
                                            onChange={this.handleChange}
                                            placeholder="Select your visa Expiry"
                                        />
                                      </Grid.Column >
                                    <Grid.Column width={4}>
                    <button style={{ marginTop: '1.5rem' }} type="button" className="ui right floated teal button" onClick={this.saveDetails}>Save</button>
                                    </Grid.Column>
                                </React.Fragment>                                
        }

  
        
        return (            

             <Grid >
                <Grid.Row>
                    <Grid.Column width={6}>
                   Visa Type
                    <Dropdown                                
                        selection
                        name="visaStatus"
                        placeholder="Select your visa"
                        options={VisaType}
                        onChange={this.handleChange}    // handles the selected options & saves it after clicking
                                />
                    </Grid.Column>                    
                   
                        {ElementToRender}
                                
                    
                </Grid.Row>
          </Grid>
        )
    }

}