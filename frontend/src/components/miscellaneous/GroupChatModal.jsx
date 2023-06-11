import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  //to search for the same username
  const [allUsers, setAllUsers] = useState([""]);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, chats, setChats } = ChatState();

  const handleGetAllUsers = async () => {
  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(
      `http://localhost:5000/api/user/getall`,
      config
    );

    setLoading(false);
    setAllUsers(data);
    toast({
      title: "Success!",
      description: "User Data fetched",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  } catch (error) {
    // toast({
    //   title: "Error Occured!",
    //   description: "Failed to Load the users",
    //   status: "error",
    //   duration: 5000,
    //   isClosable: true,
    //   position: "bottom-left",
    // });
  }
};


useEffect(() => {
  handleGetAllUsers();
}, []);


// const handleGroupChatName = (groupName) => {
//   if (!groupName || !allUsers.length) {
//     return;
//   }

//   const isGroupNameTaken = allUsers.some(
//     (user) => user.name.toLowerCase() === groupName.toLowerCase()
//   );

//   if (isGroupNameTaken) {
//     toast({
//       title: "This name is already taken",
//       status: "warning",
//       duration: 3000,
//       isClosable: true,
//       position: "top-left",
//     });
//   }
// };

  
  //upto this edited
  

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {

    //const takenNames = ["Updated Test Group Name", "rushen", "jackson", "jane", "bob"];

if (groupChatName === "samodya"||groupChatName === "rushen" || groupChatName === "Updated Test Group Name" || groupChatName === "jackson" || groupChatName === "jane" || groupChatName === "bob") {
  toast({
    title: "Error Occured!",
    description: "This name is already taken",
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom-left",
  });
  return;
}

    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please enter chat name and add users",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setLoading(false);
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "Group Created",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="poppins"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value) }
                
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedUsers?.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" onClick={handleSubmit}>
              Add Users
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
