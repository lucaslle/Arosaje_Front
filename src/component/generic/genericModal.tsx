import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalProps,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { useT } from "../../i18n/index.ts";

interface GenericModalProps extends Omit<ModalProps, "children"> {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
    children: ReactNode;
    onCancel?: () => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    isConfirmDisabled?: boolean;
}

const GenericModal: FC<GenericModalProps> = ({
                                                 isOpen,
                                                 onClose,
                                                 title,
                                                 size = "md",
                                                 children,
                                                 onCancel,
                                                 onConfirm,
                                                 confirmLabel,
                                                 isConfirmDisabled = false,
                                                 ...modalProps
                                             }) => {
    const t = useT();
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={size} {...modalProps}>
            <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(2px)" />
            <ModalContent mx={4}>
                <ModalHeader fontFamily="heading" fontWeight="normal">{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onCancel || onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button ml={3} onClick={onConfirm} isDisabled={isConfirmDisabled}>
                        {confirmLabel ?? t("common.validate")}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GenericModal;
