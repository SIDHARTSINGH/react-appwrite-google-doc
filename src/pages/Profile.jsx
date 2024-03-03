import { ID, Query } from "appwrite";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import authService from "../utils/authService";
import { AddIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import NewDocImg from "../assets/new_document.svg";
import {
  Stack,
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
  Wrap,
  WrapItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [docs, setDocs] = useState([]);
  const [dbUser, setDBUser] = useState();
  const {
    isOpen: isNewOpen,
    onOpen: onNewOpen,
    onClose: onNewClose,
  } = useDisclosure();
  const {
    isOpen: isOpenOpen,
    onOpen: onOpenOpen,
    onClose: onOpenClose,
  } = useDisclosure();
  const documentIdInput = useRef();
  const documentNameInput = useRef();

  const handleAddDoc = async () => {
    const newDoc = {
      name: documentNameInput.current.value,
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
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));

        navigate(`${location.pathname}/doc/${res.$id}`);
      })
      .catch((err) => console.error(err));
  };

  const handleOpenDoc = (doc) => {
    // console.log("opening ", doc);
    navigate(`${location.pathname}/doc/${doc.$id}`);
  };

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
            onClick={onNewOpen}
          >
            New Doc
          </Button>
          <Modal isOpen={isNewOpen} onClose={onNewClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>New Document</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Enter Document Name</FormLabel>
                  <Input ref={documentNameInput} placeholder="Document Name" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button
                  type="submit"
                  colorScheme="teal"
                  mr={3}
                  onClick={() => {
                    onNewClose();
                    handleAddDoc();
                    // console.log(documentNameInput.current.value);
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button
            leftIcon={<ExternalLinkIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={onOpenOpen}
          >
            Open Doc
          </Button>
          <Modal isOpen={isOpenOpen} onClose={onOpenClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Open Document</ModalHeader>
              <ModalCloseButton />
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
                  onClick={onOpenClose}
                >
                  <Link
                    to={`${location.pathname}/doc/${documentIdInput.current?.value}`}
                  >
                    Open
                  </Link>
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
      </Stack>
      <Box paddingBottom={"6"}>
        <Divider />
      </Box>
      <Wrap paddingX={6} spacingX={6}>
        {docs.map((doc) => (
          <WrapItem key={doc.$id}>
            <Card
              width={"200px"}
              overflow="hidden"
              variant="outline"
              _hover={{ cursor: "pointer" }}
              onClick={() => handleOpenDoc(doc)}
            >
              <Image
                objectFit="cover"
                maxW={'{ base: "100%", sm: "200px" }'}
                src={NewDocImg}
                alt="New Document"
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
                  <Text _hover={{ textDecorationLine: "underline" }}>
                    {doc.name}
                  </Text>
                </Heading>
              </CardBody>
            </Card>
          </WrapItem>
        ))}
      </Wrap>
    </div>
  );
};

export default Profile;
