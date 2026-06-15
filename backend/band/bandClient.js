const workflows = {};

export function createWorkflow(initialRequest) {
  const workflowId = `WF-${Date.now()}`;

  workflows[workflowId] = {
    workflowId,
    initialRequest,
    sharedContext: {
      citizen_report: initialRequest
    },
    messages: [],
    timeline: []
  };

  return workflows[workflowId];
}

export function sendBandMessage({ workflowId, from, to, type, payload }) {
  const workflow = workflows[workflowId];

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  const message = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    from,
    to,
    type,
    payload
  };

  workflow.messages.push(message);
  workflow.sharedContext[type] = payload;

  workflow.timeline.push({
    agent: from,
    target: to,
    action: type,
    timestamp: message.timestamp,
    status: "completed"
  });

  return message;
}

export function getWorkflow(workflowId) {
  return workflows[workflowId];
}