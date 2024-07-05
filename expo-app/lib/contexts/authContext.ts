import { createContext } from "react";
import User from "../types/user";

const authContext = createContext<{
	user: User | undefined;
	setUser: (user: User | undefined) => void;
}>({
	user: undefined,
	setUser: (user: User | undefined) => {},
});
export default authContext;
