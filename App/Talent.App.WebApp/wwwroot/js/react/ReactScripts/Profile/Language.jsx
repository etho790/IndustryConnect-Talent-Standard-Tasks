/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Icon, Dropdown, Form, Grid, Button,Table } from 'semantic-ui-react'

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        // if props.languageData is true (not null) return (or execute) Object.assign({}, props.languageData) & Dets = it
        // otherwise make Dets = the empty array 
        const Dets = props.languageData ?
            Object.assign({}, props.languageData) : {
                languages: [],               
            }

        this.state = {
            Languages: Dets,  //languages var only contains the name of the languages and is sent back to the Accprofile.jsx when you save
            addLanguageSection: null,   //essentially is div that is rendered when you click on add
            
            TempLanguageVar: {//temp var that contains the current element & the id (of a particular element, only to be updated later for the table down below)
                              //otherwise the id when adding entries will be the arbitrary number 0 
                              //to populate newLanguage array & Languages array
                id: '',
                name: '',
                level: '',
            },
            newLanguage: [],  //newLanguage is an array of the name & the level of proficiency of the languages & stays in state for this class

            LanguageDataforTableArray :[], //this array will be populated with all the entries of newLanguage AND will have a unique id for each
            update: false,

            //not used
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }

        this.HandleAddLanguage = this.HandleAddLanguage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveDetails = this.saveDetails.bind(this);
        
        this.closeEdit = this.closeEdit.bind(this)        
        this.renderDisplay = this.renderDisplay.bind(this)
        this.ClicktoUpdateFunc = this.ClicktoUpdateFunc.bind(this)
        this.HandleUpdatedChange = this.HandleUpdatedChange.bind(this)
        this.SaveUpdatedChanges = this.SaveUpdatedChanges.bind(this)
        this.DeleteUpdatedChanges = this.DeleteUpdatedChanges.bind(this)
    }

   

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label), MAINLY INPUT we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    //HANDLECHANGE FUNCTION CAN EITHER HAVE ONE PARAMETER OR IT CAN LOOK LIKE THIS "(e, { name, value })"
    //if it deviates from how it's supposed to look like it wont work as intended
    handleChange(event) {
        
        //Constantly at run time copies this.state.TempLanguageVar into data var
        const data = Object.assign({}, this.state.TempLanguageVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value

       //Constantly at run time updates the specific properties in the intended state variable
        this.setState({
            TempLanguageVar: {
                id: 0,                      //temporary arbitrary set value
                name: data['name'],
                level: data['level']
            }
        })       
    }

    saveDetails() {
        //copies the updated this.state.TempLanguageVar into data var
        const data = Object.assign({}, this.state.TempLanguageVar)
        
        this.setState({
            //This is how you dynamically fill up an array of objects with specified properties
            newLanguage: [...this.state.newLanguage, {
                name: data['name'],
                level: data['level'],                        
            }],
            //So the Languages array only has the previous entry + the name of the new language updated
            Languages: [...this.state.Languages, data['name']]      
        })        
        

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("languages", this.state.Languages)

        //close edit
        this.closeEdit()
    }

    
    HandleUpdatedChange(event) {
        //Constantly at run time copies this.state.TempLanguageVar into data var
        const data = Object.assign({}, this.state.TempLanguageVar)

        //modifies the value of the specific property in the data var
        data[event.target.name] = event.target.value
        
        //Constantly at run time updates the specific properties in the intended state variable
        this.setState(prevState => ({
            TempLanguageVar: {
                id: prevState.TempLanguageVar.id,    //id of the language gotten from ClicktoUpdateFunc, which is prevstates value
                name: data['name'],
                level: data['level']
            }
        }))       
    }

    
    SaveUpdatedChanges(){

        //gets all the entries in newLanguage and fills the languagesdataArray, to later update the specific updated entry
        let languagesdataArray = [...this.state.newLanguage];
        //copies the updated this.state.TempLanguageVar into UpdatedLanguagedata var 
        //to later update the specific entry of the languagesdataArray
        let UpdatedLanguagedata = Object.assign({}, this.state.TempLanguageVar)

        //update current entry in languagesdataArray based on the UpdatedLanguagedata.id & only updates the name & level atributes
        languagesdataArray[UpdatedLanguagedata.id] = {
            name: this.state.TempLanguageVar['name'],
            level: this.state.TempLanguageVar['level']
        }

        //this array is to update our Languages array in state that only holds the names of the languages
        let languagesArray = []
        for (var i = 0; i < languagesdataArray.length; i++) {
           languagesArray.push(languagesdataArray[i].name)            
        }

        this.setState({
            //update the state of newLanguage
            newLanguage: languagesdataArray,         
            //updated languages to equal the new updated languagesArray
            Languages: languagesArray,
            update:false
        })

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("languages", this.state.Languages)
       
    }
    

    closeEdit() {
        this.setState({
            addLanguageSection: null,
        })
    }

    render() {
        return (
            this.renderDisplay()
        )        
    }

    // when the add new button is clicked
    HandleAddLanguage(event) {

        if (this.state.addLanguageSection == null) {
            //This is how you add elements to a state variable
            this.setState({                            
                addLanguageSection : <React.Fragment>
                                        <div className="ui sixteen column grid">

                                            <div className='ui five wide column'>
                                                <input
                                                    type='text'
                                                    name='name'
                                                    placeholder='Add Language'
                                                    maxLength={80}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                            <div className='ui five wide column'>

                                                <select placeholder='Language Level' name='level' onChange={this.handleChange}>
                                                    <option value=''>Language Level</option>
                                                    <option value='Basic'>Basic</option>
                                                    <option value='Conversational'>Conversational</option>
                                                    <option value='Fluent'>Fluent</option>
                                                    <option value='Native/Bilingual'>Native/Bilingual</option>
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
        //gets all the entries in newLanguage and fills the languagesdataArray, to later update the specific updated entry
        let languagesdataArray = [...this.state.newLanguage];

        //remove current entry in languagesdataArray based on the CurrentLanguage.id
        languagesdataArray.splice(id, 1)

        //this array is to update our Language array in state that only holds the names of the Languages
        let LanguageArray = []
        for (var i = 0; i < languagesdataArray.length; i++) {
            LanguageArray.push(languagesdataArray[i].name)
        }

        this.setState({
            //update the state of newLanguage
            newLanguage: languagesdataArray,
            //updated Languages to equal the new updated LanguageArray
            Languages: LanguageArray,
        })

        console.log("Languages array", this.state.Languages)
        console.log("newLanguage array", this.state.newLanguage)

        //SAVING TO BACKEND!!!!!!
        this.props.controlFunc("languages", this.state.Languages)
    }
    
    ClicktoUpdateFunc(e, UPDATE, id) {
        //This function is responsible for PRIMARILY changing the update variable & for getting the this.state.TempLanguageVar.id
        var language;
        //we are going through the LanguageDataforTableArray array to get the exact element and stor it in our language var
        //so that we can get the element entry & update the id of our element in our TempLanguageVar state variable
        this.state.LanguageDataforTableArray.forEach(element => {
            if (id == element.id ) {
                language = element
                return
            }
        });

        //the id of the TempLanguageVar is updated for the currently clicked entry we want to update
        this.setState({
            update: UPDATE, //sets the update state to either true or false
            TempLanguageVar: {
                id: language.id,                      //id updated
                name: language.name,
                level: language.level
            }
        })
    }

   


    renderDisplay() {       

        const languages = this.state.newLanguage ? this.state.newLanguage : [];
        // LanguageDataforTable (local variable) is being populated to loop through and fill our table
        let LanguageDataforTable = [];
        LanguageDataforTable = Object.keys(languages).map((index, value ) => ({
            id: value,
            name: this.state.newLanguage[value].name,
            level: this.state.newLanguage[value].level,
           
        }))

        //this.state.LanguageDataforTableArray is being populated too but primarily
        this.state.LanguageDataforTableArray = Object.keys(languages).map((index, value) => ({
            id: value,
            name: this.state.newLanguage[value].name,
            level: this.state.newLanguage[value].level,
        }))

        return(
        <div className='ui sixteen column wide'>

            {this.state.addLanguageSection}

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Language</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                        <Table.HeaderCell className='right aligned'>
                        <button className='ui teal labeled icon button' type='button' onClick={this.HandleAddLanguage}><i className='add icon' />Add new</button>
                        </Table.HeaderCell>

                    </Table.Row>
                </Table.Header>
                    <Table.Body>
                        <React.Fragment>
                            {LanguageDataforTable.map((CurrentLanguage =>

                                <tr key={CurrentLanguage.id}>
                                    <Table.Cell >
                                    {/* the condition "CurrentLanguage.id == this.state.TempLanguageVar.id" will be met in the ClicktoUpdateFunc function */}
                                    {                                            
                                                (this.state.update && CurrentLanguage.id == this.state.TempLanguageVar.id) ?
                                                <div className='ui five wide column'>                                                   
                                                    <Form.Input
                                                        placeholder='Add Language'
                                                        name='name'
                                                        onChange={this.HandleUpdatedChange}
                                                    />
                                                </div>
                                                : CurrentLanguage.name
                                    }           {/*if the update pencil buttons not clicked just display the CurrentLanguage.name*/}
                                    
                                    </Table.Cell>
                                    <Table.Cell >
                                    {/* the condition "CurrentLanguage.id == this.state.TempLanguageVar.id" will be met in the ClicktoUpdateFunc function */}
                                    {                                       
                                        (this.state.update && CurrentLanguage.id == this.state.TempLanguageVar.id) ?
                                            <div className='ui five wide column'>
                                                    <select placeholder='Language Level' name='level' onChange={this.HandleUpdatedChange}>
                                                    <option value=''>Language Level</option>
                                                    <option value='Basic'>Basic</option>
                                                    <option value='Conversational'>Conversational</option>
                                                    <option value='Fluent'>Fluent</option>
                                                    <option value='Native/Bilingual'>Native/Bilingual</option>
                                                </select>
                                            </div>
                                            : CurrentLanguage.level
                                        }{/*if the update pencil buttons not clicked just display the CurrentLanguage.level*/}
                                                
                                    
                                    </Table.Cell>
                                    <Table.Cell className='right aligned'>


                                        <React.Fragment>
                                            {/*The right way to call a function, that has a vital arguement, has to be 'this' 
                                             * & the main argument that you would ike to pass through, Moreover the Function
                                             * MUST have the same amount of parameters, call it 'e' & the arbitrary argument names*/}

                                            {/* the condition "CurrentLanguage.id == this.state.TempLanguageVar.id" will be met in the ClicktoUpdateFunc function */}
                                            {(this.state.update && CurrentLanguage.id == this.state.TempLanguageVar.id) ?
                                                <React.Fragment>
                                                    <button className='ui blue basic button' type='button' onClick={this.SaveUpdatedChanges}>Update</button>
                                                <button className='ui basic red button' type='button' color='red' onClick={() => (this.ClicktoUpdateFunc(this, false, CurrentLanguage.id))}>Cancel</button>
                                                </React.Fragment>
                                                :
                                                <React.Fragment>
                                                    <Icon name='pencil' onClick={() => (this.ClicktoUpdateFunc(this, true, CurrentLanguage.id))} />
                                                    <Icon name='delete' onClick={() => (this.DeleteUpdatedChanges(this, CurrentLanguage.id))} />
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