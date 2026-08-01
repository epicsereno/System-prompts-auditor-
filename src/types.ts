export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AuditDimension =
  | 'Ambiguity'
  | 'Conflicts'
  | 'Gaps'
  | 'Injection surface'
  | 'Overreach'
  | 'Underreach'
  | 'Unenforceable rules'
  | 'Tool and permission scope'
  | 'Persona leakage'
  | 'Failure handling'
  | 'Structure and length'
  | 'Missing safeguards';

export interface DeploymentContext {
  userAudience: string;
  interfaceChannel: string;
  connectedTools: string[];
  scaleThroughput: string;
  failureCost: string;
}

export interface Finding {
  id: string;
  severity: Severity;
  title: string;
  dimension: AuditDimension;
  location: string;
  failureScenario: string;
  triggerInput: string;
  proposedFix: string;
}

export interface Strength {
  id: string;
  title: string;
  description: string;
  location?: string;
}

export interface RiskScores {
  overall: number; // 0 to 100 (100 = high risk)
  injectionRisk: number;
  ambiguityIndex: number;
  safeguardCoverage: number; // 0 to 100 (100 = strong coverage)
  toolSafety: number;
  enforcementGaps: number;
}

export interface PassNotes {
  literalPass: string;
  adversarialPass: string;
  holisticPass: string;
}

export interface AuditReport {
  id: string;
  timestamp: string;
  promptTitle: string;
  promptText: string;
  deploymentContext: DeploymentContext;
  verdict: {
    purpose: string;
    criticalFlaw: string;
    fullVerdict: string;
  };
  findings: Finding[];
  strengths: Strength[];
  riskScores: RiskScores;
  passNotes: PassNotes;
  revisedPrompt?: string;
}

export interface SamplePrompt {
  id: string;
  title: string;
  category: string;
  description: string;
  promptText: string;
  deploymentContext: DeploymentContext;
}

export interface TestAttackResult {
  simulatedInput: string;
  inputType: 'user_turn' | 'tool_output' | 'retrieved_document';
  agentResponse: string;
  vulnerabilityTriggered: boolean;
  explanation: string;
}
