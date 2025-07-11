export const STATUS_COLOR_MAP: Record<string, string> = {
  Completed: '#6c757d',
  Active: '#198754',
  Future: '#000000',
  Skipped: '#ffc107',
  default: '#0d6efd'
};

export const TYPE_LABEL_MAP: Record<string, { short: string, class: string }> = {
  'Hot-Fix': { short: 'HF', class: 'legend-brown' },
  'On-Demand': { short: 'OD', class: 'legend-pink' },
  Patch: { short: 'P', class: 'legend-blue' }
};