import { redirect } from "next/navigation";
import {useAuth} from "./userAuth";
import React from "react";

interface ProtectedProps{
    children : React.ReactNode
}

export default function Protected({children} : ProtectedProps){
    const isAuthenticated = useAuth();

    return isAuthenticated ? children : redirect("/");
}