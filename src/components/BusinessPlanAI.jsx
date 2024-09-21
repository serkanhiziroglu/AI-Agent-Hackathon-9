import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './BusinessPlanAI.css';

const API_KEY = '';

const BusinessPlanAI = ({ businessPlan }) => {
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateBusinessPlan = async () => {
      try {
        setLoading(true);
        setError(null);

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
          You are a market analyst who is tasked with creating a detailed marketing plan for a startup preparing their business plan. The marketing plan should be based on the product details provided below:

          Business Idea: ${businessPlan.idea}
          Description: ${businessPlan.description}
          Target Audience: ${businessPlan.targetAudience}
          Preferred Pricing: ${businessPlan.price}
          Features/Benefits: ${businessPlan.features}
          Niche Qualities: ${businessPlan.niche}
          Distribution Channel: ${businessPlan.distChannel}

          Please provide a comprehensive business plan that includes the following sections:

         1. Market Research

	•	Provide a detailed analysis of the current market for the product. Include recent trends, customer behaviors, and potential growth opportunities within the industry.

2. Niche

	•	Identify the product’s niche and explain how it differentiates from other offerings. Describe why this niche is important and how it aligns with consumer needs or demands.

3. Threat Assessment

	•	Analyze the threats that the startup may face in the market, such as economic downturns, technological disruptions, legal barriers, or competitor actions.

4. Distribution Channel

	•	Suggest the most effective distribution channels for the product. Discuss online and offline distribution strategies, partnerships, or innovative channels that could maximize reach and minimize costs.

5. Target Audience

	•	Define the target audience in detail, including demographic data, buying behavior, and preferences. Recommend ways to engage this audience through tailored marketing and advertising strategies.

6. Competitors

	•	Identify key competitors in the market. Compare their strengths and weaknesses, pricing models, and marketing strategies, and suggest ways to gain competitive advantage.

7. SWOT Analysis

	•	Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, and Threats) for the startup’s product. Give actionable insights that can guide the startup’s marketing efforts.

8. Data Requirements

	•	If more data is required to refine the marketing plan (e.g., specific sales data, customer feedback, or geographic preferences), list the additional data that would be needed to provide further insights.

9. References

	•	Provide references to relevant case studies, market research reports, or articles that support the analysis provided in each section.



          For each section, use the provided information to create specific, tailored content. If any information is missing or unclear, make reasonable assumptions based on the given details.
        `;

        const result = await model.generateContent(prompt);
        setAiResponse(result.response.text());
      } catch (err) {
        console.error('Error generating business plan:', err);
        setError(`Failed to generate the business plan: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    generateBusinessPlan();
  }, [businessPlan]);

  const formatText = (text) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      // Remove all asterisks from the beginning and end of the line
      line = line.replace(/^\*+|\*+$/g, '');

      // Function to handle bold text
      const formatBoldText = (text) => {
        return text.split(/(\*\*.*?\*\*|:\*.*?\*:|.*?\*\*:|^\w+:\*\*|\*\*\s*.*$)/).map((part, i) => {
          if (
            (part.startsWith('**') && part.endsWith('**')) ||
            (part.startsWith(':*') && part.endsWith('*:')) ||
            part.endsWith('**:') ||
            /^\w+:\*\*$/.test(part) ||
            /^\*\*\s*.*$/.test(part)  // Condition for double asterisks on the left
          ) {
            const cleanPart = part.replace(/^:\*|\*:$|^\*\*|\*\*:?$|:\*\*$|\*\*\s*/g, '');
            // Check if the bold text is not preceded or followed by numbers or colons
            if (!/^\d|:/.test(cleanPart) && !/\d|:$/.test(cleanPart)) {
              return <React.Fragment key={i}><br /><strong>{cleanPart}</strong><br /></React.Fragment>;
            }
            return <strong key={i}>{cleanPart}</strong>;
          }
          return part;
        });
      };

      // Check if the line starts with ##
      if (line.startsWith('##')) {
        // Remove ## and treat as main header
        return <h1 key={index} className="business-plan-main-header">{formatBoldText(line.replace(/^##\s*/, ''))}</h1>;
      }

      // Check if the line includes both number and asterisks
      if (/^\d+.*\*.*\*/.test(line)) {
        // Remove asterisks and treat as extra large header
        return <h1 key={index} className="business-plan-extra-large-header">{formatBoldText(line.replace(/\*/g, ''))}</h1>;
      }

      // Check if the line is a numbered main section (e.g., "1. Executive Summary")
      if (/^\d+\.\s+[A-Z]/.test(line)) {
        return <h2 key={index} className="business-plan-section-header">{formatBoldText(line)}</h2>;
      }

      // Check if the line is a subsection header (e.g., "Target Market:")
      if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*:$/.test(line)) {
        return <h3 key={index} className="business-plan-subsection-header">{formatBoldText(line)}</h3>;
      }

      // For other lines
      if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="business-plan-paragraph">{formatBoldText(line)}</p>;
      }
    });
  };

  return (
    <div className="business-plan-ai-container">
      {loading ? (
        <p>Generating your business plan, please wait...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <p>There was an error generating the business plan. Please try again later or contact support if the problem persists.</p>
        </div>
      ) : (
        <div className="business-plan">
          <h1 className="business-plan-title">Your Generated Business Plan</h1>
          <div className="business-plan-content">
            {formatText(aiResponse)}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessPlanAI;