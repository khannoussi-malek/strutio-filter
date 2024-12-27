import { GroupFilterOptions } from '@/const/operationOptions';
import { useUrlContext } from '@/context/UrlContext';
import { Box, Button, IconButton, VStack } from '@chakra-ui/react';
import { FC, memo } from 'react';
import { FiCornerDownRight, FiFile, FiX } from 'react-icons/fi';
import Select from 'react-select';
import { Blockquote } from '../ui/blockquote';
import FilterConditionComponent from './FilterCondition';

const colorPalettes = [
  'gray',
  'green',
  'pink',
  'cyan',
  'teal',
  'blue',
  'purple',
  'orange',
  'red',
  'yellow',
];

interface FilterGroupProps {
  id: string;
  path: string;
}

const FilterGroupComponent: FC<FilterGroupProps> = ({ id, path }) => {
  const {
    conditions,
    addGroup,
    addCondition,
    updateField,
    deleteItem,
  } = useUrlContext();
  const groupList = path.split('.');
  groupList.pop();
  const group = groupList.reduce(
    (acc: any, key) => acc[key],
    conditions
  );

  return (
    <Blockquote
      colorPalette={
        colorPalettes[groupList.length % colorPalettes.length]
      }
    >
      <VStack p={4} spaceY={2} alignItems="flex-start">
        {group?.conditions?.length > 1 && (
          <Select
            options={GroupFilterOptions}
            value={{
              label: group.operator,
              value: group.operator,
            }}
            onChange={(v, _) => {
              updateField(group.id, 'operator', v?.value);
            }}
            inputValue=""
            onInputChange={() => {}}
            onMenuOpen={() => {}}
            onMenuClose={() => {}}
          />
        )}
        {!!groupList.length && (
          <IconButton
            type="button"
            aria-label="Remove condition"
            colorScheme="red"
            onClick={() => deleteItem(id)}
          >
            <FiX />
          </IconButton>
        )}
        {(group?.conditions || [])?.map(
          (subCondition: any, index: number) => (
            <Box key={subCondition.id}>
              {'attributeId' in subCondition ? (
                <FilterConditionComponent
                  id={subCondition.id}
                  path={path + '.' + index}
                />
              ) : (
                <FilterGroupComponent
                  id={subCondition.id}
                  path={path + '.' + index + '.conditions'}
                />
              )}
            </Box>
          )
        )}
        <Button
          type="button"
          onClick={() => addCondition(group.id)}
          colorScheme="blue"
        >
          Add Condition
          <FiFile />
        </Button>
        <Button
          onClick={() => addGroup(group.id)}
          type="button"
          colorScheme="blue"
        >
          Add Group
          <FiCornerDownRight />
        </Button>
      </VStack>
    </Blockquote>
  );
};

export default memo(FilterGroupComponent);
