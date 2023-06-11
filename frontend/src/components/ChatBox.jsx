import { Box } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain, setFetchAgain}) => {

  const {selectedChat} = ChatState();

  return (
    <Box
      display={{base: selectedChat? "flex":"none", md:"flex"}}
      alignItems="center"
      flexDir="column"
      padding={3}
      backgroundColor="white"
      width={{base:"100%", md:"68%"}}
      borderRadius="lg"
      borderwidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain= {setFetchAgain}/>
      
    </Box>
  )
}

export default ChatBox
