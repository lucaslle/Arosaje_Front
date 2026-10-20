import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    Heading,
    VStack,
    useDisclosure,
    Box,
} from "@chakra-ui/react";
import { useLanguageStore, useT } from "../../../i18n/index.ts";

interface RGPDModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function ModalRGPD( {isOpen, onClose }: RGPDModalProps){
    const t = useT();
    const language = useLanguageStore((state) => state.language);

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent mx={4}>
                <ModalHeader fontFamily="heading" fontWeight="normal">{t("common.privacyPolicy")}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6} lang="fr">
        <Box overflow="auto" maxHeight={500}>
            <VStack align="start" spacing={4}>
                {language !== "fr" && <Text fontSize="sm" color="text.muted" lang={language}>{t("privacy.frenchOnly")}</Text>}
                <Text fontSize="sm" color="text.muted">Dernière mise à jour : 2 juillet 2025</Text>

                <Heading size="md">1. Qui sommes-nous ?</Heading>
                <Text>
                    L'application <strong>arosaje</strong> est un réseau social entre particuliers pour la garde de plantes
                    et les conseils de botanistes.
                    <br />
                    Responsable du traitement : <br />
                    AROSAJE <br />
                    Email : support@arosaje.fr <br />
                </Text>

                <Heading size="md">2. Données collectées</Heading>
                <Text>
                    Nous collectons les données suivantes :
                    <br />– Profil : nom, email, photo, ville
                    <br />– Géolocalisation (si autorisée)
                    <br />– Messages échangés
                    <br />– Informations sur les plantes
                    <br />– Activité d’utilisation (clics, navigation)
                </Text>

                <Heading size="md">3. Finalités de la collecte</Heading>
                <Text>
                    Vos données sont utilisées pour :
                    <br />– Créer votre compte et faciliter les mises en relation
                    <br />– Permettre l’échange de messages et de conseils
                    <br />– Adapter les recommandations botaniques
                    <br />– Sécuriser la plateforme
                    <br />– Améliorer les fonctionnalités
                </Text>

                <Heading size="md">4. Base légale</Heading>
                <Text>
                    Les traitements sont fondés sur :
                    <br />– Votre consentement (géolocalisation, notifications)
                    <br />– L’exécution du contrat (création de compte)
                    <br />– L’intérêt légitime (amélioration du service)
                    <br />– Nos obligations légales
                </Text>

                <Heading size="md">5. Durée de conservation</Heading>
                <Text>
                    – Compte actif : conservation des données<br />
                    – Inactivité {">"} 2 ans : suppression automatique<br />
                    – Demande de suppression possible à tout moment
                </Text>

                <Heading size="md">6. Accès aux données</Heading>
                <Text>
                    Les données sont accessibles uniquement :
                    <br />– À l’équipe interne
                    <br />– À nos prestataires techniques (hébergement, email)
                    <br />– Aux autres utilisateurs selon vos réglages
                </Text>

                <Heading size="md">7. Vos droits</Heading>
                <Text>
                    Vous pouvez exercer à tout moment vos droits :
                    <br />– Accès, rectification, suppression
                    <br />– Limitation, portabilité, opposition
                    <br />– Réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>
                </Text>

                <Heading size="md">8. Sécurité</Heading>
                <Text>
                    Nous mettons en œuvre des mesures techniques et organisationnelles :
                    chiffrement, contrôle d’accès, surveillance serveur.
                </Text>

                <Heading size="md">9. Modifications</Heading>
                <Text>
                    Cette politique peut évoluer. Vous serez informé(e) en cas de mise à jour majeure.
                </Text>

                <Heading size="md">Contact</Heading>
                <Text>
                    AROSAJE<br />
                    Email : rgpd@arosaje.fr<br />
                </Text>
            </VStack>
        </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalRGPD;