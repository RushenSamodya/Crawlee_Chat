import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toast = useToast()

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
      setLoading(true);
      if(pics=== undefined){
        toast({
          title: 'Please select an image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
      });
      return;
      }
      if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Talk-a-tive");
      data.append("cloud_name", "djvljpcro");
      fetch("https://api.cloudinary.com/v1_1/djvljpcro/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data);
          setLoading(false);
          toast({
            title: "Image uploaded successfully.",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.log(err);
          toast({
            title: "Image uploading unsuccessful.",
            status: "warning",
            duration: 4000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Please upload a jpeg or png file.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
  }; //to get the first images when user upload multiple images

  const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmPassword){
      toast({
        title: 'Please fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
    });
    setLoading(false);
    return;
  }
  if(password !== confirmPassword){
    toast({
      title: 'Passwords do not match',
      status: 'warning',
      duration: 5000,
      isClosable: true,
  });
  return;
}

try {
  const config = {
    headers: {
      "Content-Type": "application/json",	
    }
  }
  const {data} = await axios.post("http://localhost:5000/api/user", 
  { name, email, password, pic }, 
    config
    );
  toast({
          title: 'Registered successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
      })

  localStorage.setItem("userInfo", JSON.stringify(data));
  setLoading(false);
  navigate("/chats");

} catch (error) {
  toast({
          title: 'Please select an image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
      })
      setLoading(false);
}

};

  return (
    <VStack>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your email address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
        <Input
          type={show? "text":"password"}
          placeholder="Enter your password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem" onClick={handleClick}>
            <Button h="1.75rem" size="sm">
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
        <Input
          type={show? "text":"password"}
          placeholder="Enter your password again"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem" onClick={handleClick}>
            <Button h="1.75rem" size="sm">
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>

      </FormControl>

      <FormControl id="pic" >
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          placeholder="Pic here..."
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
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

    </VStack>
  );
};

export default Signup;
