import { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import {AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading';
import { getSenderName } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {

  const toast = useToast();

  const [loggedUser, setLoggedUser] = useState();
  const {user, setUser, selectedChat, setSelectedChat, chats, setChats} =  ChatState();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:5000/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);
  
  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex" , md: "flex" }}
    flexDirection="column"	
    alignItems="center"
    padding="3"
    background = "white"
    width={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize = {{ base: "28px", md: "20px" }}
        fontFamily="poppins"
        display = "flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
        <Button
         display="flex"
          fontSize={{base: "17px", md: "10px" , large: "17px"}}
          rightIcon={ <AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>

      </Box>

      <Box
      display="flex"
      flexDirection="column"
      padding="3"
      background = "#e2e2e2"
      width="100%"
      height="92%"
      borderRadius="lg"
      overflowY="hidden"
      >
        {
          chats? (
            <Stack
             overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  background={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  paddingX={3}
                  paddingY={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? (
                      getSenderName(chat.users, loggedUser)
                    ):(chat.chatName) }
                  </Text>
                </Box>
              ))}
            </Stack>
          ):(
            <ChatLoading/>
          )
        }
      </Box>
      
    </Box>
  )
}

export default MyChats
