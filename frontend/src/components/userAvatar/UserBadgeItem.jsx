import { CloseIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/react"

const UserBadgeItem = ({user, handleFunction}) => {

  return (
    <Box
        px={2}
        py={1}
        borderRadius="lg"
        margin="1"
        mb="2"
        variant="solid"
        fontSize="12"
        background="#F0634C"
        color="white"
        cursor="pointer"
        onClick={handleFunction}

    >
      {user.name}
      <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem
