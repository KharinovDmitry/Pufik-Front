import React from 'react';
import {
    ModalOverlay,
    ModalContainer,
    ModalTitle,
    ModalButtons,
    ConfirmButton,
    CancelButton
} from './styles';

export const ConfirmModal = ({
                                 isOpen,
                                 title,
                                 onConfirm,
                                 onCancel,
                                 confirmText = "Подтвердить",
                                 cancelText = "Отмена"
                             }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay>
            <ModalContainer>
                <ModalTitle>{title}</ModalTitle>
                <ModalButtons>
                    <CancelButton onClick={onCancel}>{cancelText}</CancelButton>
                    <ConfirmButton onClick={onConfirm}>{confirmText}</ConfirmButton>
                </ModalButtons>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default ConfirmModal;