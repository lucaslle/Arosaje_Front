import { FormControl, FormLabel, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import GenericModal from "../generic/genericModal.tsx";
import { api, jsonBody } from "../../api/client.ts";
import { useT } from "../../i18n/index.ts";

const AdviceModal = ({ plantId, isOpen, onClose }: { plantId: number; isOpen: boolean; onClose: () => void }) => {
    const [question, setQuestion] = useState("");
    const t = useT();
    const toast = useToast();

    const send = async () => {
        try {
            await api(`/plants/${plantId}/advice-requests`, { method: "POST", body: jsonBody({ question: question.trim() }) });
            toast({ title: t("advice.sent"), status: "success", duration: 3000, isClosable: true });
            setQuestion("");
            onClose();
        } catch (error) {
            toast({ title: t("care.actionError"), description: (error as Error).message, status: "error", duration: 4000, isClosable: true });
        }
    };

    return (
        <GenericModal isOpen={isOpen} onClose={onClose} title={t("advice.ask")} onConfirm={send} confirmLabel={t("advice.send")} isConfirmDisabled={question.trim().length < 3}>
            <FormControl isRequired>
                <FormLabel htmlFor={`advice-${plantId}`}>{t("advice.questionLabel")}</FormLabel>
                <Textarea id={`advice-${plantId}`} value={question} maxLength={1000} placeholder={t("advice.questionPlaceholder")} onChange={(e) => setQuestion(e.target.value)} />
            </FormControl>
        </GenericModal>
    );
};

export default AdviceModal;
