// import { useSelector } from "react-redux";

// export default function userAuth(){
//     const {user} = useSelector((state:any) => state.auth)

//     if(user){
//         return true
//     } else {
//         return false
//     }
// }

import { useSelector } from "react-redux";

interface AuthState {
    user: {
        id: string;
        name: string;
        email: string;
    } | null;
}


export function useAuth() {
    const { user } = useSelector((state: { auth: { user: AuthState } }) => state.auth);

    return !!user; // Returns true if user exists, otherwise false
}




