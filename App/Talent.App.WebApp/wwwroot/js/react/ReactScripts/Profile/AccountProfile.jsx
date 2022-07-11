import React from 'react';
import Cookies from 'js-cookie';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
import Education from './Education.jsx';
import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx'
import PhotoUpload from './PhotoUpload.jsx';
import VideoUpload from './VideoUpload.jsx';
import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            profileData: {
                /*firstName: '',
                lastName: '',
                email: '',
                phone:'',
                address: { 
                    number: "",
                    street: "",
                    suburb: "",
                    postCode: 0,
                    city: '',       //ADDED
                    country: '',    //ADDED
                },
                */
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                profilePhoto: '',
                linkedAccounts: {
                    linkedIn: "",
                    github: ""
                },
                jobSeekingStatus: ""
            },
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this)
        this.updateAndSaveData = this.updateAndSaveData.bind(this)
       
        this.saveProfile = this.saveProfile.bind(this)
        this.loadData = this.loadData.bind(this)
        this.init = this.init.bind(this);
        this.updateForComponentId = this.updateForComponentId.bind(this)
    };

   

    componentDidMount(){
        
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res){
                this.updateWithoutSave(res.data)//THIS RETREIVES THE DATA FROM THE DATABASE 
                                                //and updates the state profileData var

                console.log(res.data)
                
            }.bind(this),
            error: function (res) {
                console.log("error Damn", res)
               
            }.bind(this)
        })
        this.init()
    }

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Talent");
        loaderData.isLoading = false;
        this.setState({
            loaderData,
            
        })
    }
    //updates component's state without saving data
    updateWithoutSave(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        })              
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        let newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)

        console.log(newProfile)
        //!!!!!unfortunately here the newprofile for some components that are null objects on the backend to begin with
        //does not update the profileData!!!!!!!
    }

   //This function is extremely usefull for updating whole objects that exist as objects in the backend as opposed to
   //singular variables
    updateForComponentId(componentId, newValues) {
        let data = {};
        if (componentId == "") {
            data = newValues
        } else {
            data[componentId] = newValues;            
        }
        
        this.updateAndSaveData(data);
       
    }

    saveProfile() {
        
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/updateTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(this.state.profileData),
            success: function (res){
                console.log("THIS IS THE RESPONSE", res)
                if (res.success == true) {
                    
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null)
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null)
                }
            }.bind(this),
            error: function (res, a, b) {
                console.log("this is res",res)
                console.log("this is a", a)
                console.log("this is b", b)
            }
        })
    }

    render() {

        const profile = {

            firstName: this.state.profileData.firstName,
            lastName: this.state.profileData.lastName,
            email: this.state.profileData.email,
            phone: this.state.profileData.phone,

        }

      
        const visaDets = {

            visaStatus: this.state.profileData.visaStatus, 
            visaExpiryDate: this.state.profileData.visaExpiryDate 
        }

        const DescriptionData = {
            summary: this.state.profileData.summary,
            description: this.state.profileData.description
        }
                
               
        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile'
                                        >
                                             <SocialMediaLinkedAccount
                                                linkedAccounts={this.state.profileData.linkedAccounts}                                                
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Description'
                                        >
                                            <SelfIntroduction       
                                                summaryData={DescriptionData}                                               
                                                saveProfileData={this.updateAndSaveData}
                                                //component works perfectly
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details'
                                        >
                                            <IndividualDetailSection
                                                details={profile}
                                                saveProfileData={this.updateAndSaveData}
                                               //component works perfectly
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Address'
                                            tooltip='Enter your current address'>
                                            <Address
                                                    addressData={this.state.profileData.address}                                                   
                                                    controlFunc={this.updateForComponentId}
                                                //component works perfectly
                                                />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Nationality'
                                            tooltip='Select your nationality'
                                        >
                                            <Nationality
                                                nationalityData={this.state.profileData.nationality}
                                                saveProfileData={this.updateAndSaveData}
                                                //component works perfectly
                                            />
                                        </FormItemWrapper>
                                                                                                                        
                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'
                                         >
                                            <VisaStatus
                                                visaStatus={visaDets}                                                
                                                saveProfileData={this.updateAndSaveData}
                                                //component works perfectly
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in jobseeking?'
                                        >
                                            <TalentStatus
                                                status={this.state.profileData.jobSeekingStatus}                                                
                                                controlFunc={this.updateForComponentId}
                                                saveProfileData={this.updateAndSaveData}
                                                //code is correct as to how its passed in but the update of the backend data doesnt work
                                                 //just fails to update 
                                            />
                                        </FormItemWrapper>
                                        <FormItemWrapper
                                            title='Profile Photo'
                                            tooltip='Please upload your profile photo'
                                            
                                        >
                                            <PhotoUpload
                                                ProfilePic={this.state.profileData.profilePhoto}
                                                imageId={this.state.profileData.profilePhoto}
                                                controlFunc={this.updateForComponentId}
                                                savePhotoUrl='http://localhost:60290/profile/profile/updateProfilePhoto'
                                               //code is correct as to how its passed in but the update of the backend data doesnt work properly
                                                //either fails to update or even when its successfully updated, the picture (due to the variable retreived from the backend)
                                                //doesnt stick
                                            />
                                        </FormItemWrapper>
                                       
                                        <FormItemWrapper
                                            title='Languages'
                                            tooltip='Select languages that you speak'
                                        >
                                            <Language
                                                languageData={this.state.profileData.languages}
                                                saveProfileData={this.updateAndSaveData}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Skills'
                                            tooltip='List your skills'
                                        >
                                            <Skill
                                                skillData={this.state.profileData.skills}
                                                saveProfileData={this.updateAndSaveData}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>


                                        <FormItemWrapper
                                            title='Work experience'
                                            tooltip='Add your work experience'
                                        >
                                            <Experience
                                                experienceData={this.state.profileData.experience}
                                                saveProfileData={this.updateAndSaveData}
                                                controlFunc={this.updateForComponentId}
                                            />
                                        </FormItemWrapper>
                                    </div>
                                </form>
                            </div >
                        </div>

                    </div>
                </section>
            </BodyWrapper>
            
        )
    }
}
