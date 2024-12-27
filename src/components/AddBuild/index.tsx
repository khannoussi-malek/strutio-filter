import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Field } from '../ui/field';
import Select from 'react-select';
import { useState, useMemo, useCallback } from 'react';
import makeAnimated from 'react-select/animated';
import { useUrlContext } from '@/context/UrlContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCreateBuild } from '@/hooks/useCreateBuild';
import AttributeForm from './AttributeForm';

const animatedComponents = makeAnimated();

const AddBuild = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    attributes: [{ attributeId: '', value: '' }],
  });
  const {
    mutate: createBuild,
    isPending,
    error,
  } = useCreateBuild({
    onSuccess: () => {
      setFormData({
        name: '',
        description: '',
        attributes: [],
      });
    },
  });
  const { conditionOptions } = useUrlContext();

  const selectedAttributes = useMemo(
    () =>
      new Set(
        formData.attributes
          .map((attr) => attr.attributeId)
          .filter(Boolean)
      ),
    [formData.attributes]
  );

  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.attributes.length > 0 &&
      formData.attributes.every(
        (attr) =>
          attr.attributeId.trim() !== '' && attr.value.trim() !== ''
      )
    );
  }, [formData]);

  const getOptions = useCallback(
    (currentId: string) =>
      conditionOptions.filter(
        (option) =>
          !selectedAttributes.has(option.value) ||
          option.value === currentId
      ),
    [selectedAttributes, conditionOptions]
  );

  const deleteAttribute = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, idx) => idx !== index),
    }));
  }, []);

  const handleSelectChange = useCallback(
    (index: number, selectedOption: any) => {
      setFormData((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr, idx) =>
          idx === index
            ? { ...attr, attributeId: selectedOption?.value || '' }
            : attr
        ),
      }));
    },
    []
  );

  return (
    <DialogRoot size="lg">
      <DialogTrigger asChild>
        <Button variant="outline" size="xl">
          <FiPlus />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Build</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack alignItems="flex-end">
            <Field
              invalid={!formData?.name}
              label="Name"
              errorText="This field is required"
            >
              <Input
                placeholder="Enter build name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                value={formData?.name}
              />
            </Field>{' '}
            <Field
              label="Description"
              required
              invalid={
                !formData?.description ||
                formData?.description.length > 500
              }
              errorText="This field is required"
              helperText="Max 500 characters."
            >
              <Textarea
                placeholder="Start typing..."
                variant="outline"
                value={formData?.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
              />
            </Field>
            <AttributeForm />
            {formData.attributes.map((attribute, index) => (
              <HStack key={index} width="full">
                <Box flex={1}>
                  <HStack>
                    <Box w="20rem">
                      <Select
                        components={animatedComponents}
                        options={getOptions(attribute.attributeId)}
                        value={conditionOptions.find(
                          (option) =>
                            option.value === attribute.attributeId
                        )}
                        onChange={(option) =>
                          handleSelectChange(index, option)
                        }
                      />
                    </Box>
                    <Input
                      value={attribute.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          attributes: prev.attributes.map(
                            (attr, idx) =>
                              idx === index
                                ? { ...attr, value: e.target.value }
                                : attr
                          ),
                        }))
                      }
                    />
                  </HStack>
                </Box>
                {formData.attributes.length > 1 && (
                  <Button
                    variant="ghost"
                    onClick={() => deleteAttribute(index)}
                  >
                    <FiTrash2 size={20} />
                  </Button>
                )}
              </HStack>
            ))}
            <Button
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  attributes: [
                    ...prev.attributes,
                    { attributeId: '', value: '' },
                  ],
                }))
              }
              disabled={
                selectedAttributes.size === conditionOptions.length
              }
            >
              Add Attribute <FiPlus />
            </Button>
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button
            disabled={!isFormValid}
            onClick={() => createBuild(formData)}
            _loading={!!isPending}
          >
            Save
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default AddBuild;
