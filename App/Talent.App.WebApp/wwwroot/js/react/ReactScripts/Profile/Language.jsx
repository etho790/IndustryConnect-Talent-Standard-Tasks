/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { Dropdown, Form, Grid, Table } from 'semantic-ui-react'

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
            Languages: Dets,
            addLanguageSection: null,
            //!!!!!! MIGHT HAVE TO ADD AN OBJECT THAT HAS THE PROPERTIES OF name & value & THEN ADD IT ONTO LANGUAGES
            //SINCE WE CANT CHANGE THE STRUCTURE OF THE LANGUAGES ARRAY AT ALL, BUT WE CAN CHANGE IT INDIRECTLY!!!!!!!


            //not used
            updateProfile: props.updateProfileData, //props.updateProfileData is asigned to a var that can be changed in state
            saveProfile: props.saveProfileData, //props.saveProfileData is asigned to a var that can be changed in state

        }

        this.HandleAddLanguage = this.HandleAddLanguage.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveDetails = this.saveDetails.bind(this);
        this.openEdit = this.openEdit.bind(this)
        this.closeEdit = this.closeEdit.bind(this)        
        this.renderDisplay = this.renderDisplay.bind(this)
    }

   

    // NOTE The HandleChangeFunction should very closely resemble the function from the docs, because
    //based on the types of elements (ie; dropdown, input, label) we use, for it to react to userinput
    // the handlechange function given MUST be similar with the sae parameters, otherwise it will be confusing
    handleChange(event) {

        //copies this.state.LanguageLevel into data var
        const data = Object.assign({}, this.state.Languages)

        //modifies the value of the specific property in the data array
        data[event.target.name] = event.target.value
               
        this.setState({ Languages: data });
        
    }

    saveDetails() {
        //copies this.state.LanguageLevel into data var
        const data = Object.assign({}, this.state.Languages)


        //!!!!!!!!!!WILL HAVE TO LOOK INTO STUFF HERE TO ADD ONTO THE LANGUAGES ARRAY!!!!!!!!

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        //this.props.updateProfileData(data)    //MUST HAVE THE POST METHOD WORKING TO MAKE THE SAVE BUTTON WORK

        //close edit
        this.closeEdit()
    }

    openEdit() {
        this.setState({

        })
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


   

    HandleAddLanguage(event) {

        if (this.state.addLanguageSection == null) {
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


    renderDisplay() {

        //!!!!!!!!!WILL HAVE TO LOOK INTO EXPANDING THIS SECTION!!!!!!!!

        const languages = this.state.languages ? this.state.languages : [];
        let tableData = [];

        languages.map((x, index) => {
            tableData.push(<Table.Row key={x.id}>
                                <Table.Cell>
                                    { x.name}
                                </Table.Cell>
            </Table.Row>);



        });









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
                    {null}

                </Table.Body>

            </Table>
        </div>
            )

    }


 




}