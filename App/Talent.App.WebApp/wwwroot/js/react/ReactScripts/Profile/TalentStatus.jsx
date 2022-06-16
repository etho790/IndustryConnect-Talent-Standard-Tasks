import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { SingleInput } from '../Form/SingleInput.jsx';

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);

        // if props.status is true (not null) return (or execute) Object.assign({}, props.status) & Dets = it
        // otherwise make Dets = the empty array 
        const Dets = props.status ?
            Object.assign({}, props.status) : {
                status: "",
                availableDate: null
            }


        this.state = {
            showEditSection: false,
            newJobStatus: Dets
        }


        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveJobSeekingStatus = this.saveJobSeekingStatus.bind(this);

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

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event, { name, value }) {
         //Constantly at run time copies this.state.newJobStatus into data var
        const data = Object.assign({}, this.state.newJobStatus);
        //Constantly at run time modifies the value of the specific property in the data object
        data[name] = value;

        this.setState({//sets the state and UPDATES the newJobStatus var in state
            newJobStatus: data
        });
        console.log(data)
    }

    saveJobSeekingStatus() {
        const data = Object.assign({}, this.state.newJobStatus);

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        //this.props.updateProfileData( data);

        this.closeEdit();
    }

    render() {
        return (
            this.state.showEditSection ? this.renderEdit() : this.renderDisplay()
        )
    }

    renderEdit() {

        return (
            <div className="ui sixteen wide column">
                <div className='field'>
                    <label>Current Status</label>
                </div>
                <div className='sixteen wide column'>

                    <Checkbox
                        radio
                        label='Actively loooking for job'
                        name='status'
                        value='Actively loooking for job'
                        checked={this.state.newJobStatus.status === 'Actively loooking for job'}
                        onChange={this.handleChange}
                    />
                </div>
                <div className='sixteen wide column'>
                    <Checkbox
                        radio
                        label='Not looking for a job at the moment'
                        name='status'
                        value='Not looking for a job at the moment'
                        checked={this.state.newJobStatus.status === 'Not looking for a job at the moment'}
                        onChange={this.handleChange}
                    />
                </div>
                <div className='sixteen wide column'>
                    <Checkbox
                        radio
                        label='Currently employed but open to offers'
                        name='status'
                        value='Currently employed but open to offers'
                        checked={this.state.newJobStatus.status === 'Currently employed but open to offers'}
                        onChange={this.handleChange}
                    />
                </div>
                <div className='sixteen wide column'>
                    <Checkbox
                        radio
                        label='Will be available on later date'
                        name='status'
                        value='Will be available on later date'
                        checked={this.state.newJobStatus.status === 'Will be available on later date'}
                        onChange={this.handleChange}
                    />
                </div>

                <div className='ui sixteen wide column'>
                    <button type="button" className="ui teal button" onClick={this.saveJobSeekingStatus} >Save</button>
                    <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                </div>
            </div>
        );
    }

    renderDisplay() {

        const jobSeekingStatus = this.state.newJobStatus ? this.state.newJobStatus : { status: 'N/A', availableDate: '' }

        var availableDateSection;
        if (jobSeekingStatus.availableDate !== '') {
            availableDateSection = <p>{jobSeekingStatus.availableDate}</p>
            
        }

        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    {/*updates both the status and the availableDate*/}
                    <p>Current Status: {jobSeekingStatus.status}</p>
                    {availableDateSection}
                    

                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.openEdit}>Edit</button>
            </div>
        )
    }

}