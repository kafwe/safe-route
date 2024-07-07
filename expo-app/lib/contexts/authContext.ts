import { createContext } from "react";
import User from "../types/user";

const authContext = createContext<{
	user: SafeRouteUser | undefined;
	setUser: (user: SafeRouteUser | undefined) => void;
}>({
	user: undefined,
	setUser: (user: User | undefined) => {},
});

export type SafeRouteUser = User & {
	firstName: string;
	lastName: string;
	carMake?: string;
	carModel?: string;
	preferences?: {
		distance?: number;
		crime?: number;
		loadshedding?: number;
	};
};

export default authContext;
