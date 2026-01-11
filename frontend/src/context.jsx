import { createContext } from "react";

const CrossContext = createContext();
const ThreadContext = createContext();
const ActiveMessages = createContext();
const ActiveThreadId = createContext();
const UserMessageContext = createContext();

export {CrossContext , ThreadContext , ActiveMessages , ActiveThreadId , UserMessageContext};