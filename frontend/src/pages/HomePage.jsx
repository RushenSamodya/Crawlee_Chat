import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
 import { useEffect, useState } from "react";
 import { useNavigate } from "react-router-dom";


const HomePagel = () => {

   const navigate = useNavigate();
   const [user, setUser] = useState();

   useEffect(() => {
         const user = JSON.parse(localStorage.getItem("userInfo"))

         if(user){
            navigate("/chats")
         }
     }, [navigate]);

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        padding="3"
        width="100%"
        margin="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="2px"
      >
        <Text color="white" fontSize="4xl" fontFamily="poppins">
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        width="100%"
        padding="4"
        borderRadius="lg"
        borderWidth="2px"
        color="white"
      >
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList marginBottom="1em">
            <Tab width="50%">LOGIN</Tab>
            <Tab width="50%">SIGN-UP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePagel;
