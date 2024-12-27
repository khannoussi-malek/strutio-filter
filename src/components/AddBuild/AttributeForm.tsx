import { Input, Stack } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
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
import { useCreateAttribute } from '@/hooks/useCreateAttribute';
import { useState } from 'react';
import Select from 'react-select';

const typeOptions = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
];

const AttributeForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const { mutate, isPending } = useCreateAttribute();

  const handleSubmit = () => {
    if (!type) return;
    mutate(
      {
        name,
        type: type.value,
      },
      {
        onSuccess: () => {
          setName('');
          setType(null);
        },
      }
    );
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Add new attribute
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Attribute</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Stack gap="4">
            <Field label="Name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter attribute name"
                required
              />
            </Field>
            <Field label="Type">
              <Select
                value={type}
                onChange={setType}
                options={typeOptions}
                placeholder="Select type..."
                classNames={{
                  control: () => 'min-h-10',
                  container: () => 'text-sm',
                  menu: () => 'text-sm',
                }}
              />
            </Field>
          </Stack>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !type || !name.trim()}
          >
            {isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default AttributeForm;
