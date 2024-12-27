import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import uuid from 'react-uuid';
import { FilterCondition, FilterGroup } from '@/types/filter';
import {
  deserializeFilter,
  serializeFilter,
} from '@/utils/filterUtils';
import { useAttributes } from '@/hooks/useAttributes';

interface UrlContextType {
  conditions: FilterGroup;
  addGroup: (parentId: string) => void;
  addCondition: (parentId: string) => void;
  deleteItem: (itemId: string) => void;
  updateField: (
    itemId: string,
    field: keyof FilterCondition,
    value: string
  ) => void;
  conditionOptions: { label: string; value: string }[];
  updateConditions: (
    updater: (prev: FilterGroup) => FilterGroup
  ) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(
  undefined
);

// Separate component for handling URL updates
const UrlSync: React.FC<{ conditions: FilterGroup }> = React.memo(
  ({ conditions }) => {
    const router = useRouter();
    const debouncedUpdateRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (debouncedUpdateRef.current) {
        clearTimeout(debouncedUpdateRef.current);
      }

      debouncedUpdateRef.current = setTimeout(() => {
        if (conditions.conditions.length === 0) {
          router.push('/');
          return;
        }
        router.push(`?filter=${serializeFilter(conditions)}`);
      }, 300); // 300ms debounce

      return () => {
        if (debouncedUpdateRef.current) {
          clearTimeout(debouncedUpdateRef.current);
        }
      };
    }, [conditions, router]);

    return null;
  }
);

// Custom hook for managing filter state updates
const useFilterState = (initialState: FilterGroup) => {
  const [conditions, setConditions] = useState(initialState);

  const updateConditions = useCallback(
    (updater: (prev: FilterGroup) => FilterGroup) => {
      setConditions((prev) => {
        const next = updater(prev);
        return next;
      });
    },
    []
  );

  return [conditions, updateConditions] as const;
};

export const UrlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const { data: attributes = [] } = useAttributes();

  const initialState = useMemo(
    () => ({
      id: 'root',
      operator: 'AND' as const,
      conditions: [],
    }),
    []
  );

  const [conditions, updateConditions] = useFilterState(initialState);

  const conditionOptions = useMemo(
    () =>
      attributes?.map((attribute: any) => ({
        label: attribute?.name,
        value: attribute?.id,
      })),
    [attributes]
  );

  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      const filter = deserializeFilter(filterParam);
      updateConditions(() => filter as FilterGroup);
    }
  }, []);

  const addGroup = useCallback((parentId: string) => {
    const newGroup: FilterGroup = {
      operator: 'AND',
      id: uuid(),
      conditions: [],
    };

    updateConditions((prevConditions) => {
      const addGroupRecursively = (
        group: FilterGroup
      ): FilterGroup => {
        if (group.id === parentId) {
          return {
            ...group,
            conditions: [...(group.conditions || []), newGroup],
          };
        }
        return {
          ...group,
          conditions: (group.conditions || []).map((condition) =>
            'operator' in condition
              ? addGroupRecursively(condition as FilterGroup)
              : condition
          ),
        };
      };

      return addGroupRecursively(prevConditions);
    });
  }, []);

  const addCondition = useCallback((parentId: string) => {
    const newCondition: FilterCondition = {
      attributeId: '',
      operator: 'equals',
      value: '',
      id: uuid(),
    };

    updateConditions((prevConditions) => {
      const addConditionRecursively = (
        group: FilterGroup
      ): FilterGroup => {
        if (group.id === parentId) {
          return {
            ...group,
            conditions: [...(group.conditions || []), newCondition],
          };
        }
        return {
          ...group,
          conditions: (group.conditions || []).map((condition) =>
            'operator' in condition
              ? addConditionRecursively(condition as FilterGroup)
              : condition
          ),
        };
      };

      return addConditionRecursively(prevConditions);
    });
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    updateConditions((prevConditions) => {
      const deleteItemRecursively = (
        group: FilterGroup
      ): FilterGroup => {
        const updatedConditions = (group.conditions || []).filter(
          (condition) => condition.id !== itemId
        );

        if (
          updatedConditions.length === group?.conditions?.length &&
          !!updatedConditions?.length
        ) {
          return {
            ...group,
            conditions: (group.conditions || []).map((condition) =>
              'operator' in condition
                ? deleteItemRecursively(condition as FilterGroup)
                : condition
            ),
          };
        }

        return {
          ...group,
          conditions: updatedConditions,
        };
      };

      return deleteItemRecursively(prevConditions);
    });
  }, []);

  const updateField = useCallback(
    (
      itemId: string,
      field: keyof FilterCondition | keyof FilterGroup,
      value: string
    ) => {
      updateConditions((prevConditions) => {
        const updateFieldRecursively = (
          group: FilterGroup
        ): FilterGroup => {
          if (itemId === 'root' && field === 'operator') {
            return {
              ...group,
              operator: value as FilterGroup['operator'],
            };
          }
          return {
            ...group,
            conditions: (group.conditions || []).map((condition) => {
              if (condition.id === itemId) {
                return {
                  ...condition,
                  [field]:
                    field === 'operator'
                      ? (value as FilterCondition['operator'])
                      : value,
                };
              }
              if ('operator' in condition) {
                return updateFieldRecursively(
                  condition as FilterGroup
                );
              }
              return condition;
            }),
          };
        };

        return updateFieldRecursively(prevConditions);
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      conditions,
      addGroup,
      addCondition,
      deleteItem,
      updateField,
      conditionOptions,
      updateConditions,
    }),
    [
      conditions,
      addGroup,
      addCondition,
      deleteItem,
      updateField,
      conditionOptions,
      updateConditions,
    ]
  );

  return (
    <UrlContext.Provider value={contextValue}>
      <UrlSync conditions={conditions} />
      {children}
    </UrlContext.Provider>
  );
};

export const useUrlContext = () => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error(
      'useUrlContext must be used within a UrlProvider'
    );
  }
  return context;
};
