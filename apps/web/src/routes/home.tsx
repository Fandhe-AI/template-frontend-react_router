import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export function meta() {
  return [
    { title: "Frontend Template" },
    { name: "description", content: "React Router + Chakra UI template" },
  ];
}

export default function Home() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap="6" p="6">
        <Heading as="h1" size="2xl">
          Frontend Template
        </Heading>
        <Text color="fg.muted">React Router v7 + Chakra UI v3 + Turborepo</Text>
      </VStack>
    </Box>
  );
}
