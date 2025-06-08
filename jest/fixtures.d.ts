import { MessageType, Size, User } from '../src/types';
export declare const defaultDerivedMessageProps: {
    nextMessageInGroup: boolean;
    offset: number;
    showName: boolean;
    showStatus: boolean;
};
export declare const fileMessage: MessageType.File;
export declare const derivedFileMessage: MessageType.DerivedFile;
export declare const imageMessage: MessageType.Image;
export declare const derivedImageMessage: MessageType.DerivedImage;
export declare const size: Size;
export declare const textMessage: MessageType.Text;
export declare const derivedTextMessage: MessageType.DerivedText;
export declare const user: User;
