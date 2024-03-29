import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { NavLink } from "react-router-dom";


const SideDrawer = () => {

  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  
  const toast = useToast();

  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler =  () => {
    localStorage.removeItem("userInfo");
    navigate('/')
  }

  const handleSearch = async () => {
    if(!search){
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      })
      return;
    }

    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const {data} = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: `No one called ${search} found`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      })
    }
  }

  const accessChat = async (userId) => {
    
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
      const {data} = await axios.post(`http://localhost:5000/api/chat`, {userId}, config);

      if(!chats.find((chat) => chat._id === data._id)) setChats([data, ...chats]);

      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Ërror fetching the chats",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left"
      })
    }
  }

  const notificationToast = () => {
      if(notification.length){
        toast({
          title: "New Message Recieved",
          description: "You have a new message",
          status: "success",
          duration: 6000,
          isClosable: true,
          position: "top"
        })
      }
  }

  useEffect(() => {
    notificationToast();
  },[notification])
  

  

  return (
    <>
    <Box
      display="flex"
      justifyContent=" space-between"
      alignltems="center"	
      bg="white"
      width="100%"
      p="5px 10px 5px 10px"
      borderWidth= " 5px"
    >
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <Text display={{base: "none" , md: "flex" }} paddingX="4">
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily="poppins">
        Crawle Chat Portal
      </Text>
      <NavLink to="http://localhost:3000/">
        <Tooltip label="Go to back to the crawlee home page" hasArrow placement="bottom">
      <Button >
        Home
      </Button>
      </Tooltip>
      </NavLink>
      <div>
        <Menu>
          <MenuButton
            padding="1"
            marginRight="6"
          >
         {!notification.length ? (<FontAwesomeIcon  icon={faBell}/>) : <FontAwesomeIcon icon={faBell} shake style={{color: "#ff1d1d",}} />}

          </MenuButton>
          <MenuList paddingLeft={5}>
            {!notification.length && "No New Messages"}
            {notification.map((notif)=>(
              <MenuItem key={notif._id}
              onClick={() => {
                setSelectedChat(notif.chat);
                setNotification(notification.filter((n) => n !== notif));
              }}
              >
                {notif.chat.isGroupChat
                  ? `New Messages in ${notif.chat.name}`:
                  `New Message from ${getSender(user, notif.chat.users)}`
                }
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Menu marginLeft="10">
          <MenuButton
            as={Button}
            rightIcon={<FontAwesomeIcon icon={faChevronDown} />}
          >
            <Avatar 
            size="sm" 
            cursor="pointer" 
            name={user.name}
            src={user.pic}
            />
          </MenuButton>
          <MenuList >
            <ProfileModal user={user}>
             <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>
            Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </Box> 

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px"> Search Users</DrawerHeader>
        
        <DrawerBody>
            <Box>
              <Input
              placeholder="search by name or email"
              marginRight="2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              />
              <Button
              marginTop="2"	
              onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading? (
              <ChatLoading />
            ):(
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
                
              ))
            )}
            {loadingChat && <Spinner marginLeft="äuto" display="flex" />}
        </DrawerBody>
        </DrawerContent>

    </Drawer>
    </>
  )
}

export default SideDrawer
