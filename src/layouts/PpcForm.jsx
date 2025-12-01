import React, { useState } from 'react';
import { Input, FormFeedback } from 'reactstrap';
import { ppcApi } from '../features/userApis';
import BtnLoader from './loader/BtnLoader';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PpcForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const initialState = {
    leadId: '',
    mod: '',
    source: '',
    teamleader: '',
    leadQuality: '',
  };

  const [ppc, setPpc] = useState(initialState);

  const handleChange = (field, value) => {
    setPpc((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field changes
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: ''}));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!ppc.leadId.trim()) newErrors.leadId = 'Lead ID is required';
    if (!ppc.mod) newErrors.mod = 'Branch is required';
    if (!ppc.source) newErrors.source = 'Source is required';
    if (!ppc.teamleader) newErrors.teamleader = 'Team Leader is required';
    if (!ppc.leadQuality) newErrors.leadQuality = 'Lead Quality is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data } = await ppcApi(ppc);
      if (data?.success) {
        toast.success(data.message || 'Successfully Created!');
        setPpc(initialState);
        navigate('/bi/profile');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Submission failed!';
      toast.error(errorMessage);
      
      // Handle server-side validation errors if any
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const radioGroups = {
    teamleader: ['Umer', 'khula'],
    mod: ['ERC Dubai', 'ERC Abu Dhabi', 'ERC Saudi', 'Dynamic', 'Dynamic Silicon Oasis', 'ERC Oman'],
    source: ['Meta Ads', 'ppc', 'Snapchat', 'Tik Tok', 'Youtube'],
    leadQuality: [
      'Interested',
      'Interested in Other Procedure',
      'Not Interested',
      "Can't Afford",
      'Spam',
      'Other Country',
    ],
  };

  const renderRadioGroup = (label, name, options) => (
    <div className="bg-card-color rounded p-4 mb-3">
      <h3>{label}</h3>
      {options.map((option) => (
        <label key={option} className="d-flex align-items-center gap-2 my-2">
          <Input
            type="radio"
            name={name}
            value={option}
            checked={ppc[name] === option}
            onChange={(e) => handleChange(name, e.target.value)}
            invalid={!!errors[name]}
          />
          {option}
        </label>
      ))}
      {errors[name] && <div className="text-danger mt-2">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="d-flex justify-content-center">
      <div className="w-50 d-flex flex-column gap-3">
        {/* Header */}
        <div className="rounded d-flex flex-column align-items-center bg-card-color py-3 mb-4">
          <h1 className="fw-bolder">BI COMM</h1>
          <h3 className="text-success text-center">
            Quality Control - Form Lead enquiry reference to the sales agent
          </h3>
        </div>

        {/* Lead ID */}
        <div className="rounded bg-card-color p-4 mb-3">
          <label>
            Enter Lead ID:
            <Input
              type="text"
              placeholder="Enter Lead Id"
              value={ppc.leadId}
              onChange={(e) => handleChange('leadId', e.target.value)}
              invalid={!!errors.leadId}
            />
            {errors.leadId && <FormFeedback>{errors.leadId}</FormFeedback>}
          </label>
        </div>

        {/* Render all radio groups */}
        {renderRadioGroup('Team Leader', 'teamleader', radioGroups.teamleader)}
        {renderRadioGroup('Branch', 'mod', radioGroups.mod)}
        {renderRadioGroup('Source', 'source', radioGroups.source)}
        {renderRadioGroup('Lead Quality', 'leadQuality', radioGroups.leadQuality)}

        {/* Submit */}
        <div className="p-4 text-center">
          <button
            type="button"
            className="btn btn-lg d-flex gap-2 justify-content-center align-items-center"
            style={{ backgroundColor: '#39c449', color: '#fff' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <BtnLoader /> : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PpcForm;