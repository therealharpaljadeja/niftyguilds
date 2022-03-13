import { useContext, memo } from "react";
import {
	Modal,
	ModalOverlay,
	ModalHeader,
	ModalFooter,
	Button,
	useDisclosure,
	ModalContent,
} from "@chakra-ui/react";
import { Web3Context } from "../context/Web3Context";

const IsWalletInstalledModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true });
	const { isWalletInstalled } = useContext(Web3Context);
	if (!isWalletInstalled)
		return (
			<Modal
				closeOnOverlayClick={false}
				bg="var(--chakra-colors-brand-200)"
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent bg="var(--chakra-colors-brand-200)">
					<ModalHeader textAlign="center">
						Wallet Not Installed
					</ModalHeader>
					<ModalFooter justifyContent="center">
						<Button
							bg="var(--chakra-colors-brand-300)"
							variant="ghost"
						>
							Install Wallet
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	else return null;
};

export default IsWalletInstalledModal;
