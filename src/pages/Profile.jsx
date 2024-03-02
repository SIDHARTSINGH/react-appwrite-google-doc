import { ID, Query } from "appwrite";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import authService from "../utils/authService";
import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Stack,
  SimpleGrid,
  Box,
  Button,
  Image,
  Text,
  Card,
  CardBody,
  Heading,
  HStack,
  Divider,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [dbUser, setDBUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const documentIdInput = useRef();

  const handleAddDoc = async () => {
    setLoading(true);

    const newDoc = {
      user: "",
      userId: user.$id,
      data: "",
      content: `{"ops":[{"attributes":{"color":"#0047b2"},"insert":"New Doc"}]}`,
    };

    authService.databases
      .createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        ID.unique(),
        newDoc
      )
      .then((res) => {
        // console.log("Profile -> handleAddDoc -> new doc", res);

        authService.databases
          .listDocuments(
            import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APP_APPWRITE_USER_COLLECTION_ID,
            [Query.equal("Id", [`${user.$id}`])]
          )
          .then((ures) => {
            // console.log("creator", ures.documents[0]);

            const creator = ures.documents[0];
            creator.documents = [...ures.documents[0].DocIds, res.$id];
            creator.DocIds = [...ures.documents[0].DocIds, res.$id];
            delete creator.$databaseId;
            delete creator.$collectionId;
            delete creator.$createdAt;
            // console.log("updated creator", creator);

            authService.databases
              .updateDocument(
                import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APP_APPWRITE_USER_COLLECTION_ID,
                creator.$id,
                creator
              )
              .then((res) => {
                console.log("udpated user", res);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));

        navigate(`${location.pathname}/doc/${res.$id}`);
      })
      .catch((err) => console.error(err));
  };

  const handleOpenDoc = async () => {};

  useEffect(() => {
    if (!user) return;

    authService.databases
      .listDocuments(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_COLLECTION_ID,
        [Query.equal("userId", [`${user.$id}`])]
      )
      .then((res) => {
        // console.log("List of documents", res);
        setDocs(res.documents);
      })
      .catch((err) => console.error(err));

    authService.databases
      .listDocuments(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APP_APPWRITE_USER_COLLECTION_ID,
        [Query.equal("Id", [`${user.$id}`])]
      )
      .then((res) => {
        // console.log("Profile -> useEffect -> userFromDB", res);
        setDBUser(res.documents[0]);
      });
  }, [user]);

  return (
    <div className="container">
      <Stack spacing={4} padding={6}>
        <h1>Welcome, {user.name}</h1>
        <HStack spacing={"6"}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={handleAddDoc}
          >
            New Doc
          </Button>
          <Button
            leftIcon={<ExternalLinkIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={onOpen}
          >
            Open Doc
          </Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Open Document</ModalHeader>
              <ModalCloseButton />
              {/* <form onSubmit={handleOpenDoc}> */}
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Enter Document Id</FormLabel>
                  <Input ref={documentIdInput} placeholder="Document Id" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mr={3}
                  onClick={() => {
                    onClose();
                    console.log(documentIdInput.current.value);
                  }}
                >
                  <Link
                    to={`${location.pathname}/doc/${documentIdInput.current?.value}`}
                  >
                    Open
                  </Link>
                </Button>
              </ModalFooter>
              {/* </form> */}
            </ModalContent>
          </Modal>
        </HStack>
      </Stack>
      <Box paddingBottom={"6"}>
        <Divider />
      </Box>
      <SimpleGrid minChildWidth="120px" spacing="40px" paddingX={6}>
        {docs.map((doc) => (
          <Card key={doc.$id} overflow="hidden" variant="outline">
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "200px" }}
              src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              alt="Caffe Latte"
            />
            <Box
              position="absolute"
              top="50%"
              left="50%"
              height={"20px"}
              width={"20px"}
              transform="translate(-50%, -50%)"
              textAlign="center"
              color="white"
            ></Box>
            <CardBody>
              <Heading size={"sm"}>
                <Text>Document</Text>
              </Heading>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  );
};

export default Profile;
