import { createContext } from "react";
import User from "../types/user";

const authContext = createContext<{
	user:
		| (User & {
				firstName: string;
				lastName: string;
		  })
		| undefined;
	setUser: (
		user:
			| (User & {
					firstName: string;
					lastName: string;
			  })
			| undefined
	) => void;
}>({
	user: undefined,
	setUser: (user: User | undefined) => {},
});
export default authContext;
