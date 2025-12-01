import React, { useState, useEffect } from 'react';
import { createmarketing } from '../features/userApis';
import cookie from 'js-cookie';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';


const socket = io(process.env.REACT_APP_SOCKET_URL);

const MarketingForm = () => {
  const [formData, setFormData] = useState({
    leadId: '',
    teamleader: '',
    branch: '',
    source: '',
    leadQuality: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const getUser = cookie.get('user') ? JSON.parse(cookie.get('user')) : { name: 'Unknown' };

  
  const radioOptions = {
    teamleader: [
      { value: 'umer', label: 'Umer' },
      { value: 'Khula', label: 'Khula' },
    ],
    branch: [
      { value: 'ERC Dubai', label: 'ERC Dubai' },
      { value: 'ERC Abu Dhabi', label: 'ERC Abu Dhabi' },
      { value: 'ERC Saudi', label: 'ERC Saudi' },
      { value: 'Dynamic', label: 'Dynamic' },
      { value: 'Dynamic Silicon Oasis', label: 'Dynamic Silicon Oasis' },
      { value: 'ERC Oman', label: 'ERC Oman' },
    ],
    source: [
      { value: 'Meta Ads', label: 'Meta Ads' },
      { value: 'PPC', label: 'PPC' },
      { value: 'Snapchat', label: 'Snapchat' },
      { value: 'Tik Tok', label: 'Tik Tok' },
      { value: 'Youtube', label: 'Youtube' },
    ],
    leadQuality: [
      { value: 'Interested', label: 'Interested' },
      { value: 'Interested in other Procedures', label: 'Interested in other Procedures' },
      { value: 'Not intrested', label: 'Not intrested' },
      { value: 'Cant Afford', label: "Can't Afford" },
      { value: 'Spam', label: 'Spam' },
      { value: 'Other country', label: 'Other country' },
    ],
  };

  useEffect(() => {
   
    socket.emit('join-room', 'notification-Room');

   
    return () => {
      socket.off('join-room');
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leadId) newErrors.leadId = 'Lead ID is required';
    if (!formData.teamleader) newErrors.teamleader = 'Team Leader is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.source) newErrors.source = 'Source is required';
    if (!formData.leadQuality) newErrors.leadQuality = 'Lead Quality is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await createmarketing(formData);
      if (response.data) {
        toast.success("Marketing data submitted successfully!");
        
        
        socket.emit("sent-notification", {
          id: formData.leadId,
          username: getUser.name,
          description: "submitted Marketing form!",
          userRoom: "notification-Room",
        });
        
      
        setFormData({
          leadId: '',
          teamleader: '',
          branch: '',
          source: '',
          leadQuality: '',
        });
        
        navigate("/bi/profile");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit marketing data');
    } finally {
      setLoading(false);
    }
  };

  const renderRadioGroup = (title, fieldName) => (
    <div className="rounded bg-card-color p-4 mb-3">
      <h5>{title}</h5>
      <div className="row">
        {radioOptions[fieldName].map((option) => (
          <div key={option.value} className="col-md-6 mb-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={fieldName}
                id={`${fieldName}-${option.value}`}
                value={option.value}
                checked={formData[fieldName] === option.value}
                onChange={() => handleChange(fieldName, option.value)}
              />
              <label className="form-check-label" htmlFor={`${fieldName}-${option.value}`}>
                {option.label}
              </label>
            </div>
          </div>
        ))}
      </div>
      {errors[fieldName] && <div className="text-danger mt-2">{errors[fieldName]}</div>}
    </div>
  );

  return (
    <div className="d-flex justify-content-center">
      <div className="w-50 d-flex flex-column gap-3">
       
        <div className="rounded d-flex flex-column align-items-center bg-card-color py-3 mb-4">
          <h1 className="fw-bolder">BI COMM</h1>
          <h3 className="text-success text-center">
            Quality Control - Form Lead enquiry reference to the sales agent
          </h3>
        </div>

        
        <div className="rounded bg-card-color p-4 mb-3">
          <label className="w-100">
            Enter Lead ID:
            <input
              type="text"
              className={`form-control ${errors.leadId ? 'is-invalid' : ''}`}
              placeholder="Enter Lead Id"
              value={formData.leadId}
              onChange={(e) => handleChange('leadId', e.target.value)}
            />
            {errors.leadId && <div className="invalid-feedback">{errors.leadId}</div>}
          </label>
        </div>

        
        {renderRadioGroup('Team Leader', 'teamleader')}
        {renderRadioGroup('Branch', 'branch')}
        {renderRadioGroup('Source', 'source')}
        {renderRadioGroup('Lead Quality', 'leadQuality')}

        
        <div className="p-4 text-center">
          <button
            type="button"
            className="btn btn-lg d-flex gap-2 justify-content-center align-items-center"
            style={{ backgroundColor: '#39c449', color: '#fff' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketingForm;