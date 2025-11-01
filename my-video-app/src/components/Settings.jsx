import React, { useState, useEffect } from 'react';
import { IoSettingsOutline, IoPersonOutline, IoNotificationsOutline, IoMailOutline, IoCameraOutline, IoPeopleOutline, IoSchoolOutline } from 'react-icons/io5';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000',
});

const Settings = ({ onClose }) => {
  const [user, setUser] = useState({});
  const [settings, setSettings] = useState({
    emailNotifications: true,
    comments: true,
    mentions: true,
    privateComments: true,
    classEnrollments: true,
    workAndPosts: true,
    returnedWork: true,
    invitations: true,
    dueDateReminders: true
  });
  const [classrooms, setClassrooms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    fetchClassrooms();
    loadSettings();
    fetchUserProfile();
    fetchNotifications();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axiosInstance.post('/classroom/classroom-data', {
        userid: userData.id || userData._id
      });
      setClassrooms(response.data.classrooms || []);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleSettingChange = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axiosInstance.get(`/fetures/user-profile/${userData.id || userData._id}`);
      if (response.data.user.profilePhoto) {
        setProfilePhoto(`data:${response.data.user.profilePhoto.contentType};base64,${response.data.user.profilePhoto.data}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const allNotifications = [];
      for (const classroom of classrooms) {
        const response = await axiosInstance.get(`/fetures/notifications/${classroom.CRcode}`);
        allNotifications.push(...response.data.notifications.map(n => ({...n, className: classroom.CRName})));
      }
      setNotifications(allNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('userId', user.id || user._id);

    try {
      await axiosInstance.post('/fetures/update-profile-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const reader = new FileReader();
      reader.onload = (e) => setProfilePhoto(e.target.result);
      reader.readAsDataURL(file);
      
      alert('Profile photo updated successfully!');
    } catch (error) {
      alert('Failed to update profile photo');
    }
  };

  const getClassroomStudents = (classroom) => {
    return classroom.students || [];
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: '600' }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: '0' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f8f9fa'
          }}>
            {[
              { key: 'profile', label: 'Profile', icon: IoPersonOutline },
              { key: 'classes', label: 'Classes', icon: IoSchoolOutline },
              { key: 'notifications', label: 'Notifications', icon: IoNotificationsOutline }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '16px 24px',
                  border: 'none',
                  backgroundColor: activeTab === key ? 'white' : 'transparent',
                  color: activeTab === key ? '#356AC3' : '#6b7280',
                  fontWeight: activeTab === key ? '600' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: activeTab === key ? '2px solid #356AC3' : '2px solid transparent'
                }}
              >
                <Icon style={{ fontSize: '18px' }} />
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: '20px' }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <IoPersonOutline style={{ fontSize: '20px', color: '#356AC3' }} />
              <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>Profile</h3>
            </div>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '16px'
              }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #356AC3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: profilePhoto ? 'transparent' : '#356AC3',
                    backgroundImage: profilePhoto ? `url(${profilePhoto})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    {!profilePhoto && (
                      <span style={{
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '24px'
                      }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </div>
                  <label style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#356AC3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px solid white'
                  }}>
                    <IoCameraOutline style={{ color: 'white', fontSize: '14px' }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                    {user.name || 'User Name'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    {user.email || 'user@example.com'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#356AC3', fontWeight: '500' }}>
                    {user.role === 'teacher' ? 'Teacher' : 'Student'} • {classrooms.length} Classes
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                Click the camera icon to update your profile photo. To change your name, go to your account settings.
              </p>
              
              <div style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>Get emails</span>
                  <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleSettingChange('emailNotifications')}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: settings.emailNotifications ? '#356AC3' : '#ccc',
                      transition: '0.4s',
                      borderRadius: '24px'
                    }}>
                      <span style={{
                        position: 'absolute',
                        content: '',
                        height: '18px',
                        width: '18px',
                        left: settings.emailNotifications ? '23px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        transition: '0.4s',
                        borderRadius: '50%'
                      }}></span>
                    </span>
                  </label>
                </div>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                  Receive email notifications for classroom activities
                </p>
              </div>
            </div>
            </div>
          )}

          {/* Classes Tab */}
          {activeTab === 'classes' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <IoSchoolOutline style={{ fontSize: '24px', color: '#356AC3' }} />
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '20px', fontWeight: '600' }}>Enrolled Classes</h3>
              </div>
              
              <div style={{ display: 'grid', gap: '16px' }}>
                {classrooms.map((classroom) => {
                  const students = getClassroomStudents(classroom);
                  return (
                    <div key={classroom._id} style={{
                      backgroundColor: '#f8f9fa',
                      padding: '20px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>
                            {classroom.CRName}
                          </h4>
                          <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                            {classroom.CRDescription}
                          </p>
                          <div style={{ fontSize: '12px', color: '#356AC3', fontWeight: '500' }}>
                            Code: {classroom.CRcode} • Subject: {classroom.CRsubject}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: '#356AC3',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          <IoPeopleOutline />
                          {students.length} Students
                        </div>
                      </div>
                      
                      {students.length > 0 && (
                        <div>
                          <h5 style={{ margin: '12px 0 8px 0', color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                            Joined People:
                          </h5>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {students.slice(0, 10).map((student, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: 'white',
                                padding: '4px 8px',
                                borderRadius: '16px',
                                fontSize: '12px',
                                border: '1px solid #e5e7eb'
                              }}>
                                <div style={{
                                  width: '20px',
                                  height: '20px',
                                  backgroundColor: '#356AC3',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '10px',
                                  fontWeight: '600'
                                }}>
                                  {student.studentName ? student.studentName.charAt(0).toUpperCase() : 'S'}
                                </div>
                                <span style={{ color: '#374151' }}>{student.studentName}</span>
                              </div>
                            ))}
                            {students.length > 10 && (
                              <div style={{
                                padding: '4px 8px',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '16px',
                                fontSize: '12px',
                                color: '#6b7280'
                              }}>
                                +{students.length - 10} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <IoNotificationsOutline style={{ fontSize: '20px', color: '#356AC3' }} />
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>Notifications</h3>
              </div>

            {/* Email Notifications */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <IoMailOutline style={{ fontSize: '18px', color: '#356AC3' }} />
                <h4 style={{ margin: 0, color: '#1f2937', fontSize: '16px', fontWeight: '600' }}>Email</h4>
              </div>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
                These settings apply to the notifications you get by email.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', color: '#374151' }}>Allow email notifications</span>
                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleSettingChange('emailNotifications')}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: settings.emailNotifications ? '#356AC3' : '#ccc',
                    transition: '0.4s',
                    borderRadius: '24px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '18px',
                      width: '18px',
                      left: settings.emailNotifications ? '23px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.4s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </label>
              </div>

              {/* Comment Settings */}
              <div style={{ marginLeft: '20px' }}>
                <h5 style={{ margin: '16px 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Comments</h5>
                
                {[
                  { key: 'comments', label: 'Comments on your posts' },
                  { key: 'mentions', label: 'Comments that mention you' },
                  { key: 'privateComments', label: 'Private comments on work' }
                ].map(({ key, label }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{label}</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                      <input
                        type="checkbox"
                        checked={settings[key]}
                        onChange={() => handleSettingChange(key)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settings[key] ? '#356AC3' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '20px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '14px',
                          width: '14px',
                          left: settings[key] ? '19px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}

                <h5 style={{ margin: '16px 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Classes you're enrolled in</h5>
                
                {[
                  { key: 'workAndPosts', label: 'Work and other posts from teachers' },
                  { key: 'returnedWork', label: 'Returned work and grades from your teachers' },
                  { key: 'invitations', label: 'Invitations to join classes as a student' },
                  { key: 'dueDateReminders', label: 'Due-date reminders for your work' }
                ].map(({ key, label }) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{label}</span>
                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                      <input
                        type="checkbox"
                        checked={settings[key]}
                        onChange={() => handleSettingChange(key)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: settings[key] ? '#356AC3' : '#ccc',
                        transition: '0.4s',
                        borderRadius: '20px'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '14px',
                          width: '14px',
                          left: settings[key] ? '19px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.4s',
                          borderRadius: '50%'
                        }}></span>
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              </div>

              {/* Recent Notifications */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>Recent Activity</h3>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  textAlign: 'center'
                }}>
                  <div style={{
                    color: '#6b7280',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    📬 No recent notifications
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '12px',
                    color: '#9ca3af'
                  }}>
                    When teachers post new content, you'll see notifications here
                  </p>
                </div>
              </div>

              {/* Class Notifications Settings */}
              <div>
                <h3 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '18px', fontWeight: '600' }}>Class notifications</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#6b7280' }}>
                  These settings apply to both your email and device notifications for each class
                </p>
            
                {classrooms.length === 0 ? (
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      color: '#6b7280',
                      fontSize: '14px',
                      marginBottom: '8px'
                    }}>
                      🏫 No classes enrolled
                    </div>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#9ca3af'
                    }}>
                      Join a class to manage notification settings
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {classrooms.map((classroom) => (
                      <div key={classroom._id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#356AC3',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '16px'
                        }}>
                          {classroom.CRName ? classroom.CRName.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937', marginBottom: '2px' }}>
                            {classroom.CRName || 'Classroom'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {classroom.CRsubject || 'Subject'} • Code: {classroom.CRcode || 'N/A'}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#356AC3',
                          fontWeight: '500',
                          backgroundColor: 'rgba(53, 106, 195, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '12px'
                        }}>
                          Notifications On
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;