export type FilterCondition = {
  id: string;
  attributeId: string;
  operator: 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains';
  value: string;
};

export type FilterGroup = {
  id: string;
  operator: 'AND' | 'OR';
  conditions: (FilterCondition | FilterGroup)[];
};

export type SavedFilter = {
  id: string;
  name: string;
  filter: FilterGroup;
};
