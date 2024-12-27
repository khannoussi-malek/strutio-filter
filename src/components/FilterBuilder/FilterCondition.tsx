import { OPERATOR_OPTIONS } from '@/const/operationOptions';
import { useUrlContext } from '@/context/UrlContext';
import { useAttributes } from '@/hooks/useAttributes';
import {
  GridItem,
  IconButton,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import { FC } from 'react';
import { FiTrash } from 'react-icons/fi';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

interface FilterConditionProps {
  id: string;
  path: string;
}
const FilterConditionComponent: FC<FilterConditionProps> = ({
  id,
  path,
}) => {
  const { conditions, conditionOptions, deleteItem, updateField } =
    useUrlContext();
  const condition = path.split('.').reduce((acc: any, key) => {
    return acc?.[key] ?? acc;
  }, conditions);

  const { data: attributes = [] } = useAttributes();
  const options =
    OPERATOR_OPTIONS[
      attributes?.find(
        (attribute: any) => attribute?.id === condition.attributeId
      )?.type as keyof typeof OPERATOR_OPTIONS
    ] ?? OPERATOR_OPTIONS.string;

  return (
    <SimpleGrid
      key={id}
      w="full"
      columns={{ base: 2, md: 8 }}
      gap={2}
    >
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Select
          components={animatedComponents}
          options={conditionOptions}
          value={conditionOptions.find(
            (option: any) => option.value === condition.attributeId
          )}
          inputValue=""
          onChange={(selectedOption: any) => {
            if (!Array.isArray(selectedOption)) {
              updateField(
                id,
                'attributeId',
                selectedOption?.value ?? ''
              );
            }
          }}
        />
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Select
          onChange={(selectedOption: any) => {
            if (!Array.isArray(selectedOption)) {
              updateField(
                id,
                'operator',
                selectedOption?.value ?? ''
              );
            }
          }}
          inputValue=""
          components={animatedComponents}
          value={options.find(
            (option: any) => option.value === condition.operator
          )}
          options={options}
        />
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 3 }}>
        <Input
          value={condition.value}
          onChange={(e) =>
            updateField(id, 'value', e.target.value ?? '')
          }
          placeholder="Value"
        />
      </GridItem>
      <GridItem colSpan={{ base: 1, md: 1 }}>
        <IconButton
          type="button"
          aria-label="Remove condition"
          colorScheme="red"
          onClick={() => deleteItem(id)}
        >
          <FiTrash />
        </IconButton>
      </GridItem>
    </SimpleGrid>
  );
};

export default FilterConditionComponent;
