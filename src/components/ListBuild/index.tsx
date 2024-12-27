import { useBuilds } from '@/hooks/useBuilds';
import {
  Box,
  Circle,
  Code,
  Float,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { FC } from 'react';
import { LuQuote } from 'react-icons/lu';
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from '../ui/accordion';
import { Blockquote } from '../ui/blockquote';

interface ListBuildProps {
  filter: string;
}

const ListBuild: FC<ListBuildProps> = ({ filter }) => {
  const { data: builds = [], isLoading } = useBuilds(filter);
  if (isLoading) return <Spinner size="xl" />;
  return (
    <AccordionRoot size="lg" multiple collapsible>
      {builds?.map((build: any, index: number) => (
        <AccordionItem
          key={build.id}
          value={build.name}
          _hover={{ boxShadow: 'lg' }}
          p="2"
          borderRadius="md"
        >
          <AccordionItemTrigger>{build.name}</AccordionItemTrigger>
          <AccordionItemContent>
            <Blockquote
              ml="4"
              py="4"
              colorPalette="blackAlpha"
              ps="8"
              icon={
                <Float placement="middle-start">
                  <Circle
                    bg="whiteAlpha.900"
                    size="8"
                    color="purple.800"
                    boxShadow="md"
                  >
                    <LuQuote />
                  </Circle>
                </Float>
              }
            >
              {build.description}
            </Blockquote>
            {!!build.attributes.length && (
              <Code
                w="full"
                borderEndRadius="md"
                borderStartRadius={0}
                p="2"
                ml="4"
              >
                <Stack>
                  <Box>{'{'}</Box>
                  {build.attributes.map((attribute: any) => (
                    <Box key={attribute.id} px="5">
                      {attribute.attribute.name}:{attribute.value}
                    </Box>
                  ))}
                  <Box>{'}'}</Box>
                </Stack>
              </Code>
            )}
          </AccordionItemContent>
        </AccordionItem>
      ))}
    </AccordionRoot>
  );
};

export default ListBuild;
