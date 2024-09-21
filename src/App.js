import React, { useState } from 'react';
import BusinessPlanContainer from './components/BusinessPlanContainer';
import BusinessPlanAI from './components/BusinessPlanAI';

const BusinessPlanBuilder = () => {
  const [step, setStep] = useState(0);
  const [businessPlan, setBusinessPlan] = useState({
    idea: '',
    description: '',
    targetAudience: '',
    price: '',
    features: '',
    niche: '',
    distChannel: '',
  });
  const [currentInputs, setCurrentInputs] = useState({ idea: '', description: '', currentStepValue: '' });
  const [isVisible, setIsVisible] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // Manage state for AI generation

  // Steps of the business plan form
  const steps = [
    { key: 'idea', label: 'What is your business idea?' },
    { key: 'targetAudience', label: 'Who is your target audience?' },
    { key: 'price', label: 'What is your preferred pricing on the products?' },
    { key: 'features', label: 'Features/Benefits?' },
    { key: 'niche', label: 'Niche qualities?' },
    { key: 'distChannel', label: 'Your distribution channel?' },
  ];

  // Handles input change for fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentInputs((prev) => ({ ...prev, [name]: value }));
  };

  // Handles step transition when Enter key is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNextStep();
    }
  };

  // Handles step transition when "Continue" button is pressed
  const handleNextStep = () => {
    if (step === 0 && currentInputs.idea.trim() && currentInputs.description.trim()) {
      setIsVisible(false);
      setTimeout(() => {
        setBusinessPlan({
          ...businessPlan,
          idea: currentInputs.idea,
          description: currentInputs.description,
        });
        setCurrentInputs({ idea: '', description: '', currentStepValue: '' });
        setStep(step + 1); // Move to next step
        setIsVisible(true);
      }, 300);
    } else if (step > 0 && step < steps.length - 1 && currentInputs.currentStepValue.trim() !== '') {
      setIsVisible(false);
      setTimeout(() => {
        setBusinessPlan({
          ...businessPlan,
          [steps[step].key]: currentInputs.currentStepValue,
        });
        setCurrentInputs({ ...currentInputs, currentStepValue: '' });
        setStep(step + 1); // Move to next step
        setIsVisible(true);
      }, 300);
    } else if (step === steps.length - 1 && currentInputs.currentStepValue.trim() !== '') {
      setBusinessPlan({
        ...businessPlan,
        [steps[step].key]: currentInputs.currentStepValue,
      });
      setIsGenerating(true); // Trigger AI generation
    }
  };

  // Function to reset the form to the first step
  const handleGoToFirstPage = () => {
    setStep(0);
    setIsGenerating(false); // Hide AI plan generation if visible
    setCurrentInputs({ idea: '', description: '', currentStepValue: '' });
  };

  return (
    <div>
      <h1 className="business-plan-heading" onClick={handleGoToFirstPage} style={{ cursor: 'pointer' }}>
        Business Plan Builder
      </h1>
      {!isGenerating ? (
        <BusinessPlanContainer
          isVisible={isVisible}
          step={step}
          steps={steps}
          handleInputChange={handleInputChange}
          handleKeyPress={handleKeyPress}
          handleNextStep={handleNextStep}
          currentInputs={currentInputs}
          businessPlan={businessPlan}
        />
      ) : (
        <BusinessPlanAI businessPlan={businessPlan} />
      )}
    </div>
  );
};

export default BusinessPlanBuilder;
