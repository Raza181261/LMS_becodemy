'use client'

import React, { FC, useState } from 'react'
import Protected from '../hooks/useProtected'
import Heading from '../utils/Heading'
import Header from '../components/Header'
import Profile from '../components/Profile/Profile'
import { useSelector } from 'react-redux'

type Props = {}

interface User  {
        id: string;
        name: string;
        email: string;
        avatar: string | null;
}

interface AuthState {
    user: User | null;
  }


const Page: FC<Props> = (props) => {
     const [open,setOpen] = useState(false);
      const [activeItem, setActiveItem] = useState(5);
      const [route,setRoute] = useState("Login");

    const { user } = useSelector((state: { auth:  AuthState  }) => state.auth);
  return (
    <div>
        <Protected>
        <Heading
       title={`${user?.name} profile`}
       description="ELearning is a platform for students to learn and get help from teachers"
       keywords="Programming, MERN, Redux, Machine Learning"
       />
       <Header 
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
       />

       <Profile user = {user}/>
        </Protected>
    </div>
  )
}

export default Page