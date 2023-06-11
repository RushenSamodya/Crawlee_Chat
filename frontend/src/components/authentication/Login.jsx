import { Button, Container, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const enterGuestCredentials = () => {
    setEmail("guest@gmail.com");
    setPassword("guest");
  }

  const submitHandler = async() => {
      setLoading(true);
      if(email === "" || password === ""){
        toast({
          title: 'Please enter all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
      });
      setLoading(false);
      return;
  }
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      }
    }

    const { data } = await axios.post(
      "http://localhost:5000/api/user/login",	
      { email, password },
      config
    );
    toast({
      title: 'Logged in successfully',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: 'Invalid credentials',
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
    setLoading(false);
  }

}

  return (
    <Container>
      <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
          type={show? "text":"password"}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem" onClick={handleClick}>
            <Button h="1.75rem" size="sm">
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button 
      colorScheme="green"
      width="100%"
      style={{marginTop: 15}}
      onClick={submitHandler}
      isLoading={loading}
      >
      Submit
      </Button>

      <Button 
      colorScheme="red"
      width="100%"
      variant="solid"
      onClick={enterGuestCredentials}
      >
      Get Guest User Credentials
      </Button>

    </VStack>
    </Container>
  )
}

export default Login
