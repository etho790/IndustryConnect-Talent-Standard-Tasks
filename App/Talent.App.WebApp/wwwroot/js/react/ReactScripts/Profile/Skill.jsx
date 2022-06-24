/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon, Dropdown, Form, Grid, Button, Table } from 'semantic-ui-react'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);

        // if props.skillData is true (not null) return (or execute) Object.assign({}, props.skillData) & Dets = it
        // otherwise make Dets = the empty array 
        const Dets = props.skillData ?
            Object.assign({}, props.skillData) : {
                skills: [],
            }

        this.state = {
            skills: Dets,  //skills var only contains the name of the skills and is sent back to the Accprofile.jsx when you save
            addSkillSection: null,   //essentially is div that is rendered when you click on add

            TempSkillVar: {//temp var that contains the current element & the id (of a particular element, only to be updated later for the table down below)
                //otherwise the id when adding entries will be the arbitrary number 0 
                //to populate newLanguage array & Languages array
                id: '',
                name: '',
                level: '',
            },
            newSkill: [],  //newSkill is an array of the name & the level of proficiency of the newSkill & stays in state for this class

            SkillDataforTableArray: [], //this array will be populated with all the entries of newSkill AND will have a unique id for each
            update: false,

            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }

        this.HandleAddSkill = this.HandleAddSkill.bind(this);
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
    handleChange(event){

        //Constantly at run time copies this.state.TempSkillVar into data var
        const data = Object.assign({}, this.state.TempSkillVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value

        //Constantly at run time updates the specific properties in the intended state variable
        this.setState({
            TempSkillVar: {
                id: 0,                      //temporary arbitrary set value
                name: data['name'],
                level: data['level']
            }
        })
    }

    saveDetails() {
        //copies the updated this.state.TempSkillVar into data var
        const data = Object.assign({}, this.state.TempSkillVar)

        this.setState({
            //This is how you dynamically fill up an array of objects with specified properties
            newSkill: [...this.state.newSkill, {
                name: data['name'],
                level: data['level'],
            }],
            //So the skills array only has the previous entry + the name of the new skill updated
            skills: [...this.state.skills, data['name']]
        })

        console.log("skills array",this.state.skills)
        console.log("newSkill array", this.state.newSkill)

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("skills", this.state.skills)

        //close edit
        this.closeEdit()
    }

    HandleUpdatedChange(event){
        //Constantly at run time copies this.state.TempSkillVar into data var
        const data = Object.assign({}, this.state.TempSkillVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value

        //Constantly at run time updates the specific properties in the intended state variable
        this.setState(prevState => ({
            TempSkillVar: {
                id: prevState.TempSkillVar.id,    //id of the language gotten from ClicktoUpdateFunc, which is prevstates value
                name: data['name'],
                level: data['level']
            }
        }))
    }

    SaveUpdatedChanges() {

        //gets all the entries in newSkill and fills the SkillsdataArray, to later update the specific updated entry
        let SkillsdataArray = [...this.state.newSkill];

        //copies the updated this.state.TempSkillVar into UpdatedSkilldata var
        //to later update the specific entry of the SkillsdataArray
        let UpdatedSkilldata = Object.assign({}, this.state.TempSkillVar)

        //update current entry in SkillsdataArray based on the UpdatedSkilldata.id & only updates the name & level atributes
        SkillsdataArray[UpdatedSkilldata.id] = {
            name: this.state.TempSkillVar['name'],
            level: this.state.TempSkillVar['level']
        }

        //this array is to update our Skills array in state that only holds the names of the Skills
        let SkillsArray = []
        for (var i = 0; i < SkillsdataArray.length; i++) {
            SkillsArray.push(SkillsdataArray[i].name)
        }

        this.setState({
            //update the state of newSkill
            newSkill: SkillsdataArray,
            //updated skills to equal the new updated SkillsArray
            skills: SkillsArray,
            update: false
        })


        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("skills", this.state.skills)

    }

    


    closeEdit() {
        this.setState({
            addSkillSection: null,
        })
    }

    render() {
        return (
            this.renderDisplay()
        )
    }

    // when the add new button is clicked
    HandleAddSkill(event) {
        if (this.state.addSkillSection == null) {
            //This is how you add elements to a state variable
            this.setState({
                addSkillSection: <React.Fragment>
                    <div className="ui sixteen column grid">

                        <div className='ui five wide column'>
                            <input
                                type='text'
                                name='name'
                                placeholder='Add Skill'
                                maxLength={80}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className='ui five wide column'>

                            <select placeholder='Skill Level' name='level' onChange={this.handleChange}>
                                <option value=''>Skill Level</option>
                                <option value='Beginner'>Beginner</option>
                                <option value='Intermediate'>Intermediate</option>
                                <option value='Expert'>Expert</option>
                            </select>
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
        //gets all the entries in newSkill and fills the SkillsdataArray, to later update the specific updated entry
        let SkillsdataArray = [...this.state.newSkill];

        //remove current entry in SkillsdataArray based on the UpdatedSkilldata.id 
        SkillsdataArray.splice(id, 1)

        //this array is to update our Skills array in state that only holds the names of the Skills
        let SkillsArray = []
        for (var i = 0; i < SkillsdataArray.length; i++) {
            SkillsArray.push(SkillsdataArray[i].name)
        }

        this.setState({
            //update the state of newSkill
            newSkill: SkillsdataArray,
            //updated skills to equal the new updated SkillsArray
            skills: SkillsArray,           
        })

        console.log("skills array", this.state.skills)
        console.log("newSkill array", this.state.newSkill)

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("skills", this.state.skills)
    }


    ClicktoUpdateFunc(e, UPDATE, id) {
        //This function is responsible for PRIMARILY changing the update variable & for getting the this.state.TempSkillVar.id
        var Skill;
        //we are going through the SkillDataforTableArray array to get the exact element and store it in our Skill var
        //so that we can get the element entry & update the id of our element in our TempSkillVar state variable
        this.state.SkillDataforTableArray.forEach(element => {
            if (id == element.id) {
                Skill = element
                return
            }
        });

        //the id of the TempSkillVar is updated for the currently clicked entry we want to update
        this.setState({
            update: UPDATE, //sets the update state to either true or false
            TempSkillVar: {
                id: Skill.id,                      //id updated
                name: Skill.name,
                level: Skill.level
            }
        })
    }




    renderDisplay() {

        const Skills = this.state.newSkill ? this.state.newSkill : [];
        // SkillDataforTable (local variable) is being populated to loop through and fill our table
        let SkillDataforTable = [];
        SkillDataforTable = Object.keys(Skills).map((index, value) => ({
            id: value,
            name: this.state.newSkill[value].name,
            level: this.state.newSkill[value].level,

        }))

        //this.state.SkillDataforTableArray is being populated too but primarily
        this.state.SkillDataforTableArray = Object.keys(Skills).map((index, value) => ({
            id: value,
            name: this.state.newSkill[value].name,
            level: this.state.newSkill[value].level,
        }))

        return (
            <div className='ui sixteen column wide'>

                {this.state.addSkillSection}

                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Skill</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell className='right aligned'>
                                <button className='ui teal labeled icon button' type='button' onClick={this.HandleAddSkill}><i className='add icon' />Add new</button>
                            </Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <React.Fragment>
                            {SkillDataforTable.map((CurrentSkill =>
                                <tr key={CurrentSkill.id}>
                                    <Table.Cell >
                                        {/* the condition "CurrentSkill.id == this.state.TempSkillVar.id" will be met in the ClicktoUpdateFunc function */}
                                        {
                                            (this.state.update && CurrentSkill.id == this.state.TempSkillVar.id) ?
                                                <div className='ui five wide column'>
                                                    <Form.Input
                                                        placeholder='Add Skill'
                                                        name='name'
                                                        onChange={this.HandleUpdatedChange}
                                                    />
                                                </div>
                                                : CurrentSkill.name
                                        }           {/*if the update pencil buttons not clicked just display the CurrentSkill.name*/}

                                    </Table.Cell>
                                    <Table.Cell >
                                        {/* the condition "CurrentSkill.id == this.state.TempSkillVar.id" will be met in the ClicktoUpdateFunc function */}
                                        {
                                            (this.state.update && CurrentSkill.id == this.state.TempSkillVar.id) ?
                                                <div className='ui five wide column'>
                                                    <select placeholder='Skill Level' name='level' onChange={this.HandleUpdatedChange}>
                                                        <option value=''>Skill Level</option>
                                                        <option value='Beginner'>Beginner</option>
                                                        <option value='Intermediate'>Intermediate</option>
                                                        <option value='Expert'>Expert</option>
                                                    </select>
                                                </div>
                                                : CurrentSkill.level
                                        }{/*if the update pencil buttons not clicked just display the CurrentSkill.level*/}


                                    </Table.Cell>
                                    <Table.Cell className='right aligned'>

                                        <React.Fragment>
                                            {/*The right way to call a function, that has a vital arguement, has to be 'this' 
                                             * & the main argument that you would ike to pass through, Moreover the Function
                                             * MUST have the same amount of parameters, call it 'e' & the arbitrary argument names*/}

                                            {/* the condition "CurrentSkill.id == this.state.TempSkillVar.id" will be met in the ClicktoUpdateFunc function */}
                                            {(this.state.update && CurrentSkill.id == this.state.TempSkillVar.id) ?
                                                <React.Fragment>
                                                    <button className='ui blue basic button' type='button' onClick={this.SaveUpdatedChanges}>Update</button>
                                                    <button className='ui basic red button' type='button' color='red' onClick={() => (this.ClicktoUpdateFunc(this, false, CurrentSkill.id))}>Cancel</button>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <Icon name='pencil' onClick={() => (this.ClicktoUpdateFunc(this, true, CurrentSkill.id))} />
                                                    <Icon name='delete' onClick={() => (this.DeleteUpdatedChanges(this,  CurrentSkill.id))} />
                                                </React.Fragment>
                                            }
                                        </React.Fragment>
                                    </Table.Cell>

                                </tr>


                            ))}
                        </React.Fragment>
                    </Table.Body>

                </Table>
            </div>
       )
    }
}

