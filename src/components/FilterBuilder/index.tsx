'use client';

import { Box, Button, Input, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { useCreateFilter } from '@/hooks/useCreateFilter';
import { useFilters } from '@/hooks/useFilters';
import { FiFilter, FiPlus } from 'react-icons/fi';
import Select from 'react-select';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';
import { Field } from '../ui/field';

import { useUrlContext } from '@/context/UrlContext';
import FilterGroupComponent from './GroupFilter';
import { FilterCondition, FilterGroup } from '@/types/filter';

export function FilterBuilder() {
  const { data: filtes = [] } = useFilters();
  const filteOptions = filtes.map((filter: any) => ({
    label: filter.name,
    value: filter?.conditions,
  }));
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>('');
  const { mutate: saveFilter } = useCreateFilter();
  const { conditions, updateConditions } = useUrlContext();

  const removeIds = (
    filterGroup: FilterGroup
  ): Omit<FilterGroup, 'id'> => {
    return {
      operator: filterGroup.operator,
      conditions: filterGroup.conditions.map((condition) => {
        if ('conditions' in condition) {
          return removeIds(condition as FilterGroup) as FilterGroup;
        } else {
          const { id, ...rest } = condition as FilterCondition;
          return rest as FilterCondition;
        }
      }),
    };
  };
  return (
    <DrawerRoot
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      size="xl"
    >
      <DrawerBackdrop />
      <DrawerTrigger asChild>
        <Button colorScheme="blue" size="xl">
          Add Condition
          <FiFilter />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Management</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          {!!filteOptions?.length && (
            <Box mb="4">
              <Select
                options={filteOptions}
                onChange={(e: any) => {
                  const newFilter = JSON.parse(e.value);
                  updateConditions(() => newFilter);
                }}
              />
            </Box>
          )}
          <FilterGroupComponent
            id={conditions.id}
            path="conditions"
          />
        </DrawerBody>
        <DrawerFooter>
          <Field
            invalid={!name}
            label="Name"
            errorText="This field is required"
          >
            <Input
              placeholder="Name"
              variant="flushed"
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <DrawerActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerActionTrigger>
          <Button
            disabled={!name || !conditions.conditions.length}
            onClick={() => {
              saveFilter({ name, filter: removeIds(conditions) });
            }}
          >
            Save
          </Button>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
}
