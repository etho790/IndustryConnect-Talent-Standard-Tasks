using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;

        IRepository<UserSkill> _userSkillRepository;

        IRepository<UserExperience> _userExperienceRepository;
        private readonly IMongoDatabase _database;
        private IMongoCollection<User> _collection => _database.GetCollection<User>(typeof(User).Name);



        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IMongoDatabase database)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _database = database;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {

            try
            {
                var userId = _userAppContext.CurrentUserId;
                UserLanguage userLanguage = new UserLanguage
                {
                    Language = language.Name,
                    LanguageLevel = language.Level,
                    UserId = userId
                };
                _userLanguageRepository.Add(userLanguage);
                return true;
            }
            catch (Exception e)
            {
                return false;
            }

        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = null;
            try
            {
                profile = (await _userRepository.GetByIdAsync(Id));
                if (profile != null)
                {
                    var result = new TalentProfileViewModel
                    {
                        Id = profile.Id,
                        FirstName = profile.FirstName,
                        MiddleName = profile.MiddleName,
                        LastName = profile.LastName,
                        Gender = profile.Gender,
                        Email = profile.Email,
                        Phone = profile.Phone,
                        LinkedAccounts = profile.LinkedAccounts,
                        Nationality = profile.Nationality,
                        Address = profile.Address,
                        Summary = profile.Summary,
                        Description = profile.Description,
                        VisaStatus = profile.VisaStatus,
                        VisaExpiryDate = profile.VisaExpiryDate,
                        JobSeekingStatus = profile.JobSeekingStatus,
                        ProfilePhoto = profile.ProfilePhoto,
                        ProfilePhotoUrl = profile.ProfilePhotoUrl



                    };
                    return result;
                }
                return null;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                return null;
            }


        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel talent, string updaterId)
        {
            //Your code here;
            try
            {
                if (talent.Id != null)
                {
                    User existingTalent = (await _userRepository.GetByIdAsync(talent.Id));
                    existingTalent.FirstName = talent.FirstName;
                    existingTalent.MiddleName = talent.MiddleName;
                    existingTalent.LastName = talent.LastName;
                    existingTalent.Email = talent.Email;
                    existingTalent.Phone = talent.Phone;
                    existingTalent.LinkedAccounts = talent.LinkedAccounts;
                    existingTalent.Address = talent.Address;
                    existingTalent.Nationality = talent.Nationality;
                    existingTalent.VisaStatus = talent.VisaStatus;
                    existingTalent.VisaExpiryDate = talent.VisaExpiryDate;
                    existingTalent.JobSeekingStatus = talent.JobSeekingStatus;
                    existingTalent.Summary = talent.Summary;
                    existingTalent.Description = talent.Description;
                    existingTalent.UpdatedBy = updaterId;
                    existingTalent.UpdatedOn = DateTime.Now;

                    await _userRepository.Update(existingTalent);

                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }

        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                // await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };
            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment, string uri)
        {
            List<TalentSnapshotViewModel> talentSnapshots = new List<TalentSnapshotViewModel>();
            try
            {

                //Having Issue with the Data parsing with old data. So using JobseekingStatus and Address as null
                //TODO fix issue with database and querry
                /* IEnumerable<User> talents = (await _userRepository.Get(x => !x.IsDeleted && x.JobSeekingStatus.Status!=""))
                 .OrderByDescending(t => t.UpdatedOn).Skip(position).Take(increment);*/

                IEnumerable<User> talents = _collection.AsQueryable().Where(x => !x.IsDeleted).OrderByDescending(x => x.UpdatedOn).Skip(position).Take(increment);


                foreach (var talent in talents)
                {

                    talentSnapshots.Add(await BuildViewModel(talent, uri));

                }

                return talentSnapshots;
            }
            catch (Exception e)
            {
                return talentSnapshots;
            }




        }

        protected async Task<TalentSnapshotViewModel> BuildViewModel(User talent, string uri)
        {

            String level = "", currentEmployment = "";

            var currentExperience = (await _userExperienceRepository.Get(e => e.UserId == talent.Id && e.IsDeleted == false))
                .OrderByDescending(e => e.Start).FirstOrDefault();

            if (currentExperience != null)
            {
                level = currentExperience.Position;
                currentEmployment = currentExperience.Company;
            }

            var skillList = (await _userSkillRepository.Get(s => s.UserId == talent.Id && s.IsDeleted == false)).ToList();
            var skills = new List<String>();

            foreach (var skill in skillList)
            {
                skills.Add(skill.Skill);

            }
            var photoUrl = "";

            if (talent.ProfilePhoto != null)
            {
                var tempUrl = await _fileService.GetFileURL(talent.ProfilePhoto, FileType.ProfilePhoto);
                photoUrl = Path.Combine(uri, tempUrl);

            }






            var model = new TalentSnapshotViewModel
            {
                Id = talent.Id,
                CurrentEmployment = currentEmployment,
                Level = level,
                Name = talent.FirstName + " " + talent.LastName,
                Visa = talent.VisaStatus,
                Skills = skills,
                Linkedin = talent.LinkedAccounts != null ? talent.LinkedAccounts.LinkedIn : "",
                Github = talent.LinkedAccounts != null ? talent.LinkedAccounts.Github : "",
                PhotoId = photoUrl



            };

            return model;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }

        //Service to get all languages
        public async Task<IEnumerable<AddLanguageViewModel>> GetLanguages()
        {
            var userId = _userAppContext.CurrentUserId;
            var languages = (await _userLanguageRepository.Get(language => language.UserId == userId && language.IsDeleted == false));
            List<AddLanguageViewModel> lists = new List<AddLanguageViewModel>();
            foreach (var language in languages)
            {
                var languageView = new AddLanguageViewModel
                {
                    Id = language.Id,
                    CurrentUserId = userId,
                    Name = language.Language,
                    Level = language.LanguageLevel

                };
                lists.Add(languageView);
            }

            return lists;

        }

        public async Task<bool> updateLanguage(AddLanguageViewModel language)
        {
            try
            {

                var userId = _userAppContext.CurrentUserId;

                if (userId == language.CurrentUserId)
                {
                    UserLanguage userLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);

                    userLanguage.Language = language.Name;
                    userLanguage.LanguageLevel = language.Level;
                    await _userLanguageRepository.Update(userLanguage);
                    return true;

                }
                else
                {
                    return false;
                }

            }
            catch (Exception e)
            {
                return false;
            }

        }

        public async Task<bool> deleteLanguage(AddLanguageViewModel language)
        {
            try
            {

                var userId = _userAppContext.CurrentUserId;

                if (userId == language.CurrentUserId)
                {
                    UserLanguage userLanguage = await _userLanguageRepository.GetByIdAsync(language.Id);
                    userLanguage.IsDeleted = true;
                    await _userLanguageRepository.Update(userLanguage);
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<IEnumerable<AddSkillViewModel>> GetSkills()
        {
            var userId = _userAppContext.CurrentUserId;
            var skills = (await _userSkillRepository.Get(s => s.UserId == userId && s.IsDeleted == false));

            List<AddSkillViewModel> lists = new List<AddSkillViewModel>();

            foreach (var skill in skills)
            {
                AddSkillViewModel skillViewModel = new AddSkillViewModel
                {
                    Id = skill.Id,
                    Name = skill.Skill,
                    Level = skill.ExperienceLevel
                };
                lists.Add(skillViewModel);
            }

            return lists;

        }

        public async Task<bool> AddSkill(AddSkillViewModel skill)
        {
            try
            {
                if (String.IsNullOrWhiteSpace(skill.Name) || String.IsNullOrWhiteSpace(skill.Level))
                {
                    return false;
                }
                else
                {
                    var userId = _userAppContext.CurrentUserId;
                    UserSkill userSkill = new UserSkill
                    {
                        Skill = skill.Name,
                        ExperienceLevel = skill.Level,
                        UserId = userId
                    };

                    await _userSkillRepository.Add(userSkill);
                    return true;
                }

            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateSkill(AddSkillViewModel skill)
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                var skillEntity = await _userSkillRepository.GetByIdAsync(skill.Id);

                if (skillEntity.UserId == userId)
                {
                    skillEntity.Skill = skill.Name;
                    skillEntity.ExperienceLevel = skill.Level;

                    await _userSkillRepository.Update(skillEntity);
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteSkill(AddSkillViewModel skill)
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                var skillEntity = await _userSkillRepository.GetByIdAsync(skill.Id);
                if (skillEntity.UserId == userId)
                {
                    skillEntity.IsDeleted = true;
                    await _userSkillRepository.Update(skillEntity);
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<IEnumerable<ExperienceViewModel>> GetExperiences()
        {
            var userId = _userAppContext.CurrentUserId;
            var experiences = (await _userExperienceRepository.Get(e => e.UserId == userId && e.IsDeleted == false));

            List<ExperienceViewModel> lists = new List<ExperienceViewModel>();

            foreach (var e in experiences)
            {
                ExperienceViewModel experience = new ExperienceViewModel
                {
                    Id = e.Id,
                    Company = e.Company,
                    Position = e.Position,
                    Responsibilities = e.Responsibilities,
                    Start = e.Start,
                    End = e.End
                };
                lists.Add(experience);
            }
            return lists;
        }

        public async Task<bool> AddExperience(ExperienceViewModel experience)
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                UserExperience userExperience = new UserExperience
                {
                    Company = experience.Company,
                    Position = experience.Position,
                    Responsibilities = experience.Responsibilities,
                    Start = experience.Start,
                    End = experience.End,
                    UserId = userId
                };
                await _userExperienceRepository.Add(userExperience);
                return true;


            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateExperience(ExperienceViewModel experience)
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                var userExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);

                if (userExperience.UserId == userId)
                {
                    userExperience.Company = experience.Company;
                    userExperience.Position = experience.Position;
                    userExperience.Responsibilities = experience.Responsibilities;
                    userExperience.Start = experience.Start;
                    userExperience.End = experience.End;

                    await _userExperienceRepository.Update(userExperience);

                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }

        public async Task<bool> DeleteExperience(ExperienceViewModel experience)
        {
            try
            {
                var userId = _userAppContext.CurrentUserId;
                var userExperience = await _userExperienceRepository.GetByIdAsync(experience.Id);
                if (userExperience.UserId == userId)
                {
                    userExperience.IsDeleted = true;
                    await _userExperienceRepository.Update(userExperience);
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        #endregion

    }
}
