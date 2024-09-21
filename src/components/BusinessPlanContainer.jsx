import React from 'react';
import './BusinessPlanContainer.css';

const BusinessPlanContainer = ({
  isVisible,
  step,
  steps,
  handleInputChange,
  handleKeyPress,
  handleNextStep,
  currentInputs,
  businessPlan
}) => {
  return (
    <div className="business-plan-container">
      <div className={`business-plan-form-container ${isVisible ? 'visible' : 'hidden'}`}>
        {step === 0 ? (
          <div className="business-plan-step-container">
            <label className="business-plan-label">What is your business idea?</label>
            <input
              type="text"
              name="idea"
              value={currentInputs.idea}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="business-plan-input"
              autoFocus
            />
            <label className="business-plan-label">Provide a short description of your business idea</label>
            <input
              type="text"
              name="description"
              value={currentInputs.description}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="business-plan-input"
            />
            <button className="business-plan-button" onClick={handleNextStep}>
              Continue
            </button>
          </div>
        ) : step < steps.length ? (
          <div className="business-plan-step-container">
            <label className="business-plan-label">{steps[step].label}</label>
            <input
              type="text"
              name="currentStepValue"
              value={currentInputs.currentStepValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="business-plan-input"
              autoFocus
            />
            <button className="business-plan-button" onClick={handleNextStep}>
              Continue
            </button>
          </div>
        ) : null /* After the last step, the view transitions to the AI plan */
        }
      </div>
    </div>
  );
};

export default BusinessPlanContainer;
