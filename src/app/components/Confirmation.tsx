// hooks/useConfirmationModal.tsx
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { ReactNode, useRef, useState } from "react";

interface UseConfirmationModalProps {
  title: string;
  body: ReactNode;
  onConfirm: () => void;
}

export const useConfirmationModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [props, setProps] = useState<UseConfirmationModalProps | null>(null);

  const cancelRef = useRef<HTMLButtonElement>(null);

  const ConfirmationModal: React.FC = () => {
    if (!props) return null;

    return (
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {props.title}
            </AlertDialogHeader>
            <AlertDialogBody>{props.body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  props.onConfirm();
                  onClose();
                }}
                ml={3}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };

  const triggerModal = (modalProps: UseConfirmationModalProps) => {
    setProps(modalProps);
    onOpen();
  };

  return {
    triggerModal,
    ConfirmationModal,
  };
};
