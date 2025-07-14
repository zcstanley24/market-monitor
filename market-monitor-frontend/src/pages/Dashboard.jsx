
import {
  Box,
  Flex,
  VStack,
  Text,
  Link,
  Heading,
} from '@chakra-ui/react';

const Dashboard = () => {
  return (
    <Flex height="100vh" width="100vw" flexDirection="column">
      {/* Top header/banner */}
      <Box bg="blue.600" color="white" px={6} py={4} flexShrink={0}>
        <Heading size="md">My Dashboard</Heading>
      </Box>

      {/* Main area: sidebar + content */}
      <Flex flex="1" overflow="hidden">
        {/* Sidebar */}
        <Box
          bg="gray.800"
          color="white"
          width="250px"
          padding={4}
          flexShrink={0}
          overflowY="auto"
        >
          <VStack align="start" spacing={4}>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Home
            </Link>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Profile
            </Link>
            <Link href="#" _hover={{ textDecoration: "none", bg: "gray.700" }} px={2} py={1} rounded="md" width="100%">
              Settings
            </Link>
          </VStack>
        </Box>

        {/* Main content */}
        <Box flex="1" bg="gray.50" p={6} overflowY="auto">
          <Heading size="lg" mb={4}>
            Dashboard Content
          </Heading>
          <Text>
            This area stretches to fill the remaining width and height of the screen.
          </Text>
          {/* Your dashboard widgets/components go here */}
        </Box>
      </Flex>
    </Flex>);
}

export default Dashboard