/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { Button, Table, Icon} from 'semantic-ui-react'

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);

        //dont need to get anything from the props apart from the function call when you uplos the picture
       
        this.state = {
            fileUploadState: null,
            selectedFile: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.onFileUpload  = this.onFileUpload .bind(this);
        this.checkFileExtension = this.checkFileExtension.bind(this);
       
    };


    handleChange(event){
        var imageFile = event.target.files[0];
        
        var isValidImage = this.checkFileExtension(imageFile['type']);
        if (isValidImage) {
            this.setState({
                fileUploadState: imageFile,
                selectedFile: URL.createObjectURL(event.target.files[0])
                //once selectedFile has the file it enables displays it
            })
        } else {
            alert("Invalid File Extension");
        }

    }

    checkFileExtension(fileType) {
        const validImageTypes = ['image/jpeg', 'image/png'];

        //returns a bool based on the fileType passed in
        return validImageTypes.includes(fileType);
    }
  

    // On file upload (click the upload button)
    onFileUpload(){

        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        formData.append(
            "myFile",
            this.state.selectedFile          
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);

        //Calls the updateProfileData function passed in as props in the accountProfile jsx
        //the updateProfileData calls a function that takes 1 argument. and the argument passed in data
        //this.props.updateProfileData(this.state.selectedFile)
        
    };


    render() {      

        return (
            <div className='ui sixteen wide column'>

                {/* execute the first div if this.state.selectedFile is not null or true */}
                {(this.state.selectedFile) ?
                    <div>                                           {/*styling to make the picture circular in shape & appear centered*/}
                        <img src={this.state.selectedFile} style={{ borderRadius: 75, height: 150, width: 150, marginLeft: 'auto', marginRight: 'auto', display: 'block'  }}/>
                        <Button style={{ marginTop: '10px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }} type='button' icon='upload' color='black' name='upload' content='upload' onClick={this.onFileUpload} />
                    </div > :  <React.Fragment>
                                <input type="file"
                                        id="file"
                                        style={{ display: "none" }}
                                        onChange={this.handleChange}/>
                                <label htmlFor="file" >
                                    <Icon className='camera retro'
                                        circular size='huge'
                                        style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
                                    </Icon>
                                </label>
                                {/*the icon is wrapped around an input type, which means if you click on the icon, it acts like a button*/}
                                </React.Fragment>
                                

                 }

                
            </div>
        );
    
        
    }
}

