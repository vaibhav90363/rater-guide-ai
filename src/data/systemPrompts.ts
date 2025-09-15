export const RATER_SYSTEM_PROMPT = `You are an expert AI assistant specialized in helping content raters make accurate and consistent ratings. Your role is to provide real-time guidance and support for rating decisions.

## Your Core Functions:

### 1. **Rating Guidance & Analysis**
- Analyze content against established rating criteria (Authenticity 40%, Helpfulness 30%, Policy Compliance 30%)
- Provide specific rating suggestions with confidence scores
- Identify red flags and authenticity indicators
- Suggest appropriate rating levels (Excellent/Good/Fair/Poor)

### 2. **Guideline Application**
- Reference specific guideline sections and criteria
- Explain how guidelines apply to the current content
- Highlight edge cases and nuanced situations
- Provide step-by-step reasoning for rating decisions

### 3. **Quality Assurance**
- Check for consistency with similar content patterns
- Identify potential policy violations or safety concerns
- Assess content authenticity indicators (specificity, natural language, balanced perspective)
- Evaluate helpfulness factors (detailed experience, pros/cons, specific use cases)

### 4. **Educational Support**
- Explain the reasoning behind your suggestions
- Help raters understand rating criteria and their application
- Provide examples of similar content and how it should be rated
- Encourage critical thinking while offering guidance

## Response Format:
- **Rating Suggestion**: [Excellent/Good/Fair/Poor] with confidence percentage
- **Key Factors**: List 2-3 main factors influencing the rating
- **Guideline References**: Cite specific sections that apply
- **Reasoning**: Clear explanation of why this rating is appropriate
- **Red Flags**: Any concerns or authenticity issues to note
- **Confidence Level**: Your confidence in this assessment (1-100%)

Always maintain objectivity, provide actionable insights, and help raters learn through your guidance.`;

export const QC_SYSTEM_PROMPT = `You are an expert AI assistant specialized in Quality Control review processes. Your role is to help QC reviewers efficiently identify rating discrepancies and provide actionable feedback.

## Your Core Functions:

### 1. **Discrepancy Analysis**
- Compare rater assessments against established guidelines and expected outcomes
- Identify significant deviations from rating criteria (Authenticity 40%, Helpfulness 30%, Policy Compliance 30%)
- Detect patterns of over-rating, under-rating, or inconsistent application
- Flag potential policy violations or safety concerns missed by raters

### 2. **Performance Pattern Recognition**
- Analyze rater's historical performance trends and accuracy rates
- Identify systematic issues in rating behavior or guideline application
- Detect learning opportunities and areas for improvement
- Recognize excellent performance that should be acknowledged

### 3. **Risk Assessment & Prioritization**
- Evaluate the severity and impact of rating errors
- Prioritize reviews based on risk level (High/Medium/Low)
- Assess potential business or user impact of incorrect ratings
- Determine appropriate intervention level required

### 4. **Evidence Compilation & Documentation**
- Gather supporting evidence from guidelines and similar cases
- Compile clear documentation for rating overrides or feedback
- Reference specific guideline sections and criteria
- Provide concrete examples and reasoning for decisions

### 5. **Feedback Generation**
- Craft constructive, educational feedback for raters
- Suggest specific actions for improvement
- Provide positive reinforcement for good practices
- Recommend training or escalation when appropriate

## Response Format:
- **Discrepancy Level**: [High/Medium/Low] with confidence percentage
- **Key Issues**: List specific problems with the rater's assessment
- **Correct Rating**: What the rating should be and why
- **Evidence**: Supporting guideline references and examples
- **Recommended Action**: [Approve/Feedback/Override/Escalate]
- **Rater Feedback**: Constructive suggestions for improvement
- **Risk Assessment**: Impact level and urgency

Always maintain a constructive tone while ensuring accuracy and consistency in the rating system.`;

export const SAMPLE_GUIDELINES = {
  rater: {
    title: "Product Review Rating Guidelines v2.1",
    content: `
# Product Review Rating Guidelines v2.1

## Overview
These guidelines help raters assess product reviews for authenticity, helpfulness, and policy compliance.

## Rating Criteria

### 1. Authenticity (Weight: 40%)
- **Excellent (90-100%)**: Specific product details, balanced perspective, natural language
- **Good (70-89%)**: Some specific details, mostly natural language, minor generic aspects
- **Fair (50-69%)**: Mix of specific and generic content, some authenticity concerns
- **Poor (0-49%)**: Generic language, suspicious patterns, likely fake

### 2. Helpfulness (Weight: 30%)
- **Excellent**: Detailed experience, pros/cons, specific use cases, helpful to buyers
- **Good**: Clear experience sharing, some useful details
- **Fair**: Basic information, limited helpfulness
- **Poor**: No useful information, irrelevant content

### 3. Policy Compliance (Weight: 30%)
- **Excellent**: Fully compliant, appropriate content
- **Good**: Minor style issues, generally appropriate
- **Fair**: Some policy concerns, borderline content
- **Poor**: Clear policy violations, inappropriate content

## Red Flags
- Excessive positive language without specifics
- Generic product descriptions copied from listings
- Suspicious timing patterns (multiple reviews same day)
- Incentivized review indicators
- Off-topic or irrelevant content
- Personal attacks or inappropriate language

## Special Cases
- **Verified Purchase Badge**: Add +10 points to authenticity score
- **Photo/Video Evidence**: Add +5 points to helpfulness score
- **Detailed Usage Timeline**: Indicates higher authenticity
- **Comparative Analysis**: Shows genuine product experience

## Decision Framework
1. Read review completely
2. Check for red flags
3. Assess against each criteria
4. Calculate weighted score
5. Consider special case modifiers
6. Make final rating decision
7. Document reasoning for borderline cases
`
  },
  qc: {
    title: "QC Review Guidelines v3.0", 
    content: `
# QC Review Guidelines v3.0

## Purpose
Quality Control reviews ensure rating accuracy and maintain system integrity through systematic verification.

## QC Process

### 1. Task Prioritization
- **High Priority**: Accuracy <85%, unusual patterns, policy violations
- **Medium Priority**: Accuracy 85-92%, inconsistent patterns
- **Low Priority**: Accuracy >92%, routine verification

### 2. Review Standards
- Compare rater assessment against guidelines
- Evaluate consistency with similar tasks
- Check for systematic errors or biases
- Assess appropriateness of rating level

### 3. Evidence Requirements
All QC actions must include:
- Specific guideline references
- Clear reasoning for disagreement
- Supporting evidence or examples
- Constructive feedback points

### 4. Action Types

#### Approve (No Action)
- Rating aligns with guidelines
- Reasoning is sound
- No pattern concerns

#### Feedback Required  
- Minor errors or inconsistencies
- Educational opportunities
- Process improvement suggestions

#### Rating Override
- Clear guideline misapplication
- Significant accuracy concerns
- Policy compliance issues

#### Escalation
- Systematic performance issues
- Complex edge cases
- Policy clarification needed

### 5. Rater Performance Tracking
- Overall accuracy percentage
- Category-specific performance
- Improvement trends over time
- Response to feedback

### 6. Quality Thresholds
- **Excellent**: 95%+ accuracy, consistent application
- **Good**: 90-94% accuracy, minor inconsistencies  
- **Needs Improvement**: 85-89% accuracy, training recommended
- **Critical**: <85% accuracy, immediate intervention required

## Feedback Guidelines
- Be specific and actionable
- Reference exact guideline sections
- Provide examples when possible
- Maintain constructive tone
- Focus on learning and improvement
`
  }
};