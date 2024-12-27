export const OPERATOR_OPTIONS = {
  string: [
    { value: 'equals', label: 'Equals' },
    { value: 'contains', label: 'Contains' },
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'gt', label: 'Greater Than' },
    { value: 'lt', label: 'Less Than' },
    { value: 'gte', label: 'Greater or Equal' },
    { value: 'lte', label: 'Less or Equal' },
  ],
  boolean: [{ value: 'equals', label: 'Equals' }],
};

export const GroupFilterOptions = [
  { value: 'AND', label: 'AND' },
  { value: 'OR', label: 'OR' },
] as { value: string; label: string }[];
