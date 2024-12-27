'use client';
import AddBuild from '@/components/AddBuild';
import { FilterBuilder } from '@/components/FilterBuilder';
import ListBuild from '@/components/ListBuild';
import { UrlProvider } from '@/context/UrlContext';
import {
  Center,
  Container,
  Flex,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();

  const filter = searchParams.get('filter') || '';
  return (
    <Center minH="100vh">
      <Container maxW="3xl">
        <UrlProvider>
          <VStack>
            <Flex justifyContent="space-between" w="full">
              <AddBuild />
              <FilterBuilder />
            </Flex>
            <ListBuild filter={filter} />
          </VStack>
        </UrlProvider>
      </Container>
    </Center>
  );
}
