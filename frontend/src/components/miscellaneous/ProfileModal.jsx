import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'


const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
        {
            children ? (
                <span onClick={onOpen}>{children}</span>
            ):(
                <IconButton display={{base:"flex"}} onClick={onOpen} icon={<ViewIcon/>} />
            )
        }

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>

          <ModalHeader
            fontSize="40px"
            display="flex"
            justifyContent="center"
          >
            {user.name}
            </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.name}
            />
            <Text
            fontSize={{base:"28px", md:"30px"}}
            >
                email:{user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='orange' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
   