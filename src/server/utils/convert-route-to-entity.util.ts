const mapping: Record<string, string> = {
  'diet-plans': 'diet_plan',
  empresas: 'empresa',
  questionnaires: 'questionnaire',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
