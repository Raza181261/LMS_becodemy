'use client'
import React from 'react'
import AdminSidebar from '../../components/Admin/Sidebar/AdminSidebar'
import Heading from '../../../app/utils/Heading'
import DashboardHeader from '../../../app/components/Admin/DashboardHeader'
import AdminProtected from '../../../app/hooks/adminProtected'
import EditHero from "../../components/Admin/Customization/EditHero"

type Props = {}

const page = (props: Props) => {
  return (
    <div>
        <AdminProtected>
        <Heading
         title="ELearning - Admin"
         description="ELearning is a platform for students to learn and get help from teachers"
         keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className='flex h-screen'>
            <div className='1500px:w-[16%] w-1/5'>
              <AdminSidebar/>
            </div>
            <div className='w-[85%]'>
             <DashboardHeader/>
             <EditHero/>
            </div>
        </div>
        </AdminProtected>
    </div>
  )
}

export default page