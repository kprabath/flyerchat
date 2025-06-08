"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.derivedTextMessage = exports.textMessage = exports.size = exports.derivedImageMessage = exports.imageMessage = exports.derivedFileMessage = exports.fileMessage = exports.defaultDerivedMessageProps = void 0;
exports.defaultDerivedMessageProps = {
    nextMessageInGroup: false,
    offset: 12,
    showName: false,
    showStatus: true,
};
exports.fileMessage = {
    author: {
        id: 'userId',
    },
    createdAt: 2000000,
    id: 'file-uuidv4',
    mimeType: 'application/pdf',
    name: 'flyer.pdf',
    size: 15000,
    status: 'seen',
    type: 'file',
    uri: 'file:///Users/admin/flyer.pdf',
};
exports.derivedFileMessage = {
    ...exports.fileMessage,
    ...exports.defaultDerivedMessageProps,
};
exports.imageMessage = {
    author: {
        id: 'image-userId',
    },
    createdAt: 0,
    height: 100,
    id: 'image-uuidv4',
    name: 'name',
    size: 15000,
    status: 'sending',
    type: 'image',
    uri: 'https://avatars1.githubusercontent.com/u/59206044',
    width: 100,
};
exports.derivedImageMessage = {
    ...exports.imageMessage,
    ...exports.defaultDerivedMessageProps,
};
exports.size = {
    height: 896,
    width: 414,
};
exports.textMessage = {
    author: {
        id: 'userId',
    },
    createdAt: 0,
    id: 'uuidv4',
    text: 'text',
    type: 'text',
};
exports.derivedTextMessage = {
    ...exports.textMessage,
    ...exports.defaultDerivedMessageProps,
};
exports.user = {
    id: 'userId',
};
