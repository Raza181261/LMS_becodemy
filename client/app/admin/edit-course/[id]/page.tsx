'use client'
import React, { use } from 'react'
import AdminSidebar from '../../../components/Admin/Sidebar/AdminSidebar'
import Heading from '../../../../app/utils/Heading'
// import CreateCourse from '../../../components/Admin/Course/CreateCourse'
import DashboardHeader from '../../../../app/components/Admin/DashboardHeader'
import EditCourse from '../../../components/Admin/Course/EditCourse'


type Props = {
  params: Promise<{ id: string }> 
}

// const page = ({params}:any) => {
//     const id = params?.id
const page = ({ params }: Props) => {
  const { id } = use(params) 
  return (
    <div>
        <Heading
         title="ELearning - Admin"
         description="ELearning is a platform for students to learn and get help from teachers"
         keywords="Programming, MERN, Redux, Machine Learning"
        />
        <div className='flex'>
            <div className='1500px:w-[16%] w-1/5'>
              <AdminSidebar/>
            </div>
            <div className='w-[85%]'>
             <DashboardHeader/>
             {/* <CreateCourse/> */}
             <EditCourse id={id}/>
            </div>
        </div>
    </div>
  )
}

export default page