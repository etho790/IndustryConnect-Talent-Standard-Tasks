/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { Table, Icon, Form  } from 'semantic-ui-react';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        // if props.experienceData is true (not null) return (or execute) Object.assign({}, props.experienceData) & Dets = it
        // otherwise make Dets = the empty array 
        const Dets = props.experienceData ?
            Object.assign({}, props.experienceData) : {
                //experience: [],
            }

        this.state = {
            Experience: Dets,  //Experience var only contains the id, company, position, responsibilities, start & end of every entry and is sent back to the Accprofile.jsx when you save
            addExperienceSection: null,   //essentially is div that is rendered when you click on add

            TempExperienceVar: {
                //temp var that contains the current element & the id (of a particular element, only to be updated later for the table down below)
                //otherwise the id when adding entries will be the arbitrary number 0 
                //to populate Experience array
                id: '',
                company: '',
                position: '',
                responsibilities: '',
                start: '',
                end: ''
            },            

            ExperienceDataforTableArray: [], //this array will be populated with all the entries of Experience AND will have a unique id for each
            update: false,

            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }  
        
        this.HandleAddExperience = this.HandleAddExperience.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveDetails = this.saveDetails.bind(this);

        this.closeEdit = this.closeEdit.bind(this)
        this.renderDisplay = this.renderDisplay.bind(this)
        this.ClicktoUpdateFunc = this.ClicktoUpdateFunc.bind(this)
        this.HandleUpdatedChange = this.HandleUpdatedChange.bind(this)
        this.SaveUpdatedChanges = this.SaveUpdatedChanges.bind(this)
        this.DeleteUpdatedChanges = this.DeleteUpdatedChanges.bind(this)

    };

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event) {

        //Constantly at run time copies this.state.TempExperienceVar into data var
        const data = Object.assign({}, this.state.TempExperienceVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value

        //Constantly at run time updates the specific properties in the intended state variable
        this.setState({
            TempExperienceVar: {
                id: 0,                      //temporary arbitrary set value
                company: data['company'],
                position: data['position'],
                responsibilities: data['responsibilities'],
                start: data['start'],
                end: data['end']
            }
        })
    }

    saveDetails() {
        //copies the updated this.state.TempExperienceVar into data var
        const data = Object.assign({}, this.state.TempExperienceVar)

        this.setState({
            //This is how you dynamically fill up an array of objects with specified properties
            Experience: [...this.state.Experience, {
                company: data['company'],
                position: data['position'],
                responsibilities: data['responsibilities'],
                start: data['start'],
                end: data['end']
            }],
            
        })

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("experience", this.state.Experience)

        //close edit
        this.closeEdit()
    }

    HandleUpdatedChange(event) {
        //Constantly at run time copies this.state.TempExperienceVar into data var
        const data = Object.assign({}, this.state.TempExperienceVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value

        //Constantly at run time updates the specific properties in the intended state variable
        this.setState(prevState => ({
            TempExperienceVar: {
                id: prevState.TempExperienceVar.id,                      //id of the language gotten from ClicktoUpdateFunc, which is prevstates value
                company: data['company'],
                position: data['position'],
                responsibilities: data['responsibilities'],
                start: data['start'],
                end: data['end']
            }
        }))
    }

    SaveUpdatedChanges() {

        //gets all the entries in Experience and fills the ExperiencedataArray, to later update the specific updated entry
        let ExperiencedataArray = [...this.state.Experience];
        //copies the updated this.state.TempExperienceVar into UpdatedExperiencedata var
        //to later update the specific entry of the languagesdataArray
        let UpdatedExperiencedata = Object.assign({}, this.state.TempExperienceVar)

        //update current entry in ExperiencedataArray based on the UpdatedExperiencedata.id & only updates the name & level atributes
        ExperiencedataArray[UpdatedExperiencedata.id] = {                        
            company: this.state.TempExperienceVar['company'],
            position: this.state.TempExperienceVar['position'],
            responsibilities: this.state.TempExperienceVar['responsibilities'],
            start: this.state.TempExperienceVar['start'],
            end: this.state.TempExperienceVar['end']
        }
       
        this.setState({
            //update the state of Experience
            Experience: ExperiencedataArray,           
            update: false
        })

        //SAVING TO BACKEND!!!!!!

        this.props.controlFunc("experience", this.state.Experience)

    }



    closeEdit() {
        this.setState({
            addExperienceSection: null,
        })
    }

    render() {
        return (
            this.renderDisplay()
        )
    }

    // when the add new button is clicked
    HandleAddExperience(event) {

        if (this.state.addExperienceSection == null) {
            //This is how you add elements to a state variable
            this.setState({
                addExperienceSection: <React.Fragment>
                    <div className="ui sixteen column grid">

                        <div className='ui eight wide column'>
                            <label>Company</label>
                            <input
                                type='text'
                                name="company"
                                placeholder="Company"
                                maxLength={80}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='ui eight wide column'>
                            <label>Position</label>
                            <input
                                type='text'
                                name="position"
                                placeholder="Position"
                                maxLength={80}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='ui eight wide column field'>
                            <label>Start Date</label>
                            <input type='date' name='start' onChange={this.handleChange}></input>
                        </div>
                        <div className='ui eight wide column field'>
                            <label>End Date</label>
                            <input type='date' name='end'  onChange={this.handleChange}></input>
                        </div>
                        <div className='ui sixteen wide column'>
                            <input                                
                                type="text"
                                name="responsibilities"
                                placeholder="Responsibilities"
                                maxLength={80}
                                onChange={this.handleChange}
                            />
                        </div>

                        <div className='ui four wide column'>
                            <button type="button" className="ui teal button" onClick={this.saveDetails} >Add</button>
                            <button type="button" className="ui button" onClick={this.closeEdit}>Cancel</button>
                        </div>
                    </div>
                </React.Fragment>

            })
        }

    }


    //DELETES SELECTED ELEMENT
    DeleteUpdatedChanges(e, id) {
        //gets all the entries in Experience and fills the ExperiencedataArray, to later update the specific updated entry
        let ExperiencedataArray = [...this.state.Experience];

        //remove current entry in ExperiencedataArray based on the CurrentExperience.id
        ExperiencedataArray.splice(id, 1)
                

        this.setState({            
            Experience: ExperiencedataArray,
        })

        console.log("Experiences array", this.state.Experience)     

        //SAVING TO BACKEND!!!!!!
        
        this.props.controlFunc("experience",this.state.Experience)
    }

    ClicktoUpdateFunc(e, UPDATE, id) {       

        //This function is responsible for PRIMARILY changing the update variable & for getting the this.state.TempExperienceVar.id
        var Experience;
        //we are going through the ExperienceDataforTableArray array to get the exact element and stor it in our Experience var
        //so that we can get the element entry & update the id of our element in our TempExperienceVar state variable
        this.state.ExperienceDataforTableArray.forEach(element => {
            if (id == element.id) {
                Experience = element
                return
            }
        });

        console.log(this.state.ExperienceDataforTableArray)

        //the id of the TempExperienceVar is updated for the currently clicked entry we want to update
        
        this.setState({
            update: UPDATE, //sets the update state to either true or false

            TempExperienceVar: {
                id: Experience.id,                      //id updated
                company: Experience.company,
                position: Experience.position,
                responsibilities: Experience.responsibilities,
                start: Experience.start,
                end: Experience.end
            }           
        })
    }

       

    renderDisplay() {

        
        const Experiences = this.state.Experience ? this.state.Experience : [];

        // ExperienceDataforTable (local variable) is being populated to loop through and fill our table
        let ExperienceDataforTable = [];
        ExperienceDataforTable = Object.keys(Experiences).map((index, value) => ({
            id: value,
            company: this.state.Experience[value].company,
            position: this.state.Experience[value].position,
            responsibilities: this.state.Experience[value].responsibilities,
            start: this.state.Experience[value].start,
            end: this.state.Experience[value].end

        }))
        

        //this.state.LanguageDataforTableArray is being populated too but primarily
        this.state.ExperienceDataforTableArray = Object.keys(Experiences).map((index, value) => ({
            id: value,
            company: this.state.Experience[value].company,
            position: this.state.Experience[value].position,
            responsibilities: this.state.Experience[value].responsibilities,
            start: this.state.Experience[value].start,
            end: this.state.Experience[value].end
        }))


        return (
            <div className='ui sixteen column wide'>

                {this.state.addExperienceSection}

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Company</Table.HeaderCell>
                            <Table.HeaderCell>Position</Table.HeaderCell>
                            <Table.HeaderCell>Responsibilities</Table.HeaderCell>
                            <Table.HeaderCell>Start</Table.HeaderCell>
                            <Table.HeaderCell>End</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>
                                <button className='ui teal labeled icon button' type='button' onClick={this.HandleAddExperience}><i className='add icon' />Add new</button>
                            </Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <React.Fragment>
                            {/* the condition "CurrentEntry.id == this.state.TempExperienceVar.id" will be met in the ClicktoUpdateFunc function */}
                            {/* the first half up tp to ":" renders the updating boxes for each prt (ie; company, position, etc), if this.state.update is true/not null & CurrentEntry.id == this.state.TempExperienceVar.id */}
                            {/*which will be met as stated before in the ClicktoUpdateFunc function, otherwise it just renders the pre existing value for each attribute (ie; company, position, etc)*/}
                            {ExperienceDataforTable.map((CurrentEntry =>
                                (this.state.update && CurrentEntry.id == this.state.TempExperienceVar.id) ?
                                    <Table.Row key={CurrentEntry.id}>
                                        <Table.Cell className='field' colSpan='3'>
                                            <label>Company</label>
                                            <input
                                                type='text'
                                                name="company"
                                                placeholder="Company"
                                                maxLength={80}
                                                onChange={this.HandleUpdatedChange}
                                            />
                                        
                                            <label>Start Date</label>
                                            <input type='date' name='start' onChange={this.HandleUpdatedChange}></input>
                                       
                                            <label>Responsibilities</label>
                                            <input
                                                type="text"
                                                name="responsibilities"
                                                placeholder="Responsibilities"
                                                maxLength={80}
                                                onChange={this.HandleUpdatedChange}
                                            />
                                        
                                            <button type="button" className="ui teal button" onClick={this.SaveUpdatedChanges} >Update</button>
                                            <button type="button" className="ui button" onClick={() => (this.ClicktoUpdateFunc(this, false, CurrentEntry.id))}>Cancel</button>
                                        
                                        </Table.Cell>
                                        <Table.Cell verticalAlign='top' className='field' colSpan='3'>
                                        
                                           <label>Position</label>
                                                <input
                                                    type='text'
                                                    name="position"
                                                    placeholder="Position"
                                                    maxLength={80}
                                                    onChange={this.HandleUpdatedChange}
                                                />

                                            <label>End Date</label>
                                            <input type='date' name='end' onChange={this.HandleUpdatedChange}></input>
                                        </Table.Cell>

                                     </Table.Row >
                                    :  <Table.Row key={CurrentEntry.id}>
                                            <Table.Cell>{CurrentEntry.company}</Table.Cell>
                                            <Table.Cell>{CurrentEntry.position}</Table.Cell>
                                            <Table.Cell>{CurrentEntry.responsibilities}</Table.Cell>
                                            <Table.Cell>{CurrentEntry.start}</Table.Cell>
                                            <Table.Cell>{CurrentEntry.end}</Table.Cell>
                                            <Table.Cell className='right aligned'>
                                               <Icon name='pencil' onClick={() => (this.ClicktoUpdateFunc(this, true, CurrentEntry.id))} />
                                               <Icon name='delete' onClick={() => (this.DeleteUpdatedChanges(this, CurrentEntry.id))} />
                                            </Table.Cell>
                                        </Table.Row>

                            ))}
                        </React.Fragment>
                    </Table.Body>

                </Table>
            </div>
        )

    }






}
