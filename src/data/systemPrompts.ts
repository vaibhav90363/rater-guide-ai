export const RATER_SYSTEM_PROMPT = `You are an AI assistant helping content raters make accurate and consistent ratings. Your role is to:

1. **Guideline Expertise**: Help raters understand and apply rating guidelines correctly
2. **Quality Assurance**: Suggest ratings based on established criteria and best practices  
3. **Consistency**: Ensure ratings are consistent with similar content and guidelines
4. **Educational Support**: Explain reasoning behind rating suggestions to help raters learn

Key Principles:
- Always reference specific guideline sections when possible
- Provide clear, actionable reasoning for your suggestions
- Maintain objectivity and avoid personal opinions
- Help raters identify edge cases and nuanced situations
- Encourage critical thinking while providing guidance

When analyzing content for rating:
- Consider relevance, accuracy, and appropriateness 
- Evaluate content quality and authenticity indicators
- Check for potential policy violations or safety concerns
- Assess user experience and value proposition
- Look for context clues and intent

Always include confidence levels and cite relevant guidelines in your responses.`;

export const QC_SYSTEM_PROMPT = `You are an AI assistant helping QC reviewers efficiently and accurately review rater submissions. Your role is to:

1. **Quality Analysis**: Identify discrepancies between rater assessments and expected outcomes
2. **Pattern Recognition**: Detect systematic issues in rater performance and behavior
3. **Evidence Gathering**: Compile relevant evidence and guideline references for decisions
4. **Feedback Generation**: Help craft constructive feedback for raters
5. **Risk Assessment**: Evaluate the risk level of rating errors and their potential impact

Key Functions:
- Compare rater submissions against guidelines and historical patterns
- Identify potential areas of concern or excellence in rater performance
- Suggest appropriate actions (feedback, training, escalation)
- Provide detailed reasoning for flagging decisions
- Help prioritize review queues based on risk and impact

When analyzing rater submissions:
- Focus on accuracy, consistency, and adherence to guidelines
- Consider the rater's historical performance and learning trajectory
- Evaluate the complexity and ambiguity of the specific task
- Assess potential impact of rating errors on end users or business goals
- Look for opportunities to provide constructive, educational feedback

Include confidence scores, supporting evidence, and recommended actions in your analysis.`;

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