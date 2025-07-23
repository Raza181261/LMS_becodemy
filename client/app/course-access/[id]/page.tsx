// "use client"

// import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
// import { redirect } from 'next/navigation'
// import React, { useEffect } from 'react'
// import CourseContent from '../../components/Course/CourseContent'
// import Loader from '@/app/components/Loader/Loader'

// type Props = {
//     params:any
// }

// const Page = ({params}: Props) => {
//     const id = params.id;

//     const {isLoading, data, error} = useLoadUserQuery(undefined,{});

//     useEffect(() => {
//       if(!data){
//         redirect("/");
//       }
//          if(data){
//             const isPurchased = data.user.courses.find((item:any) => item._id === id);
//             if(!isPurchased){
//                 redirect("/");
//             }
//             if(error){
//                 redirect("/");
//             }
//          }

//     },[data, error,id]);
//   return (
//     <>
//      {
//         isLoading ? (
//             <Loader/>
//         ) : (
//             <div>
//                 <CourseContent id={id}/>
//             </div>
//         )
//      }
//     </>
//   )
// }

// export default Page

"use client";

import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { redirect } from 'next/navigation';
import React, { useEffect, use } from 'react';
import CourseContent from '../../components/Course/CourseContent';
import Loader from '@/app/components/Loader/Loader';

type Props = {
  params: Promise<{ id: string }>; // params is a Promise now
};

const Page = ({ params }: Props) => {
  const { id } = use(params); // ✅ unwrap the params Promise

  const { isLoading, data, error } = useLoadUserQuery(undefined, {});

  // useEffect(() => {
  //   if (data) {
  //     const isPurchased = data.user.courses.find((item: any) => item._id === id);
  //     if (!isPurchased) {
  //       redirect('/');
  //     }
  //     if (error) {
  //       redirect('/');
  //     }
  //   }
  // }, [data, error, id]);
  useEffect(() => {
  if (data?.user?.courses) {
    const isPurchased = data.user.courses.find((item: any) => item._id === id);

    if (!isPurchased || error) {
      redirect('/');
    }
  } else if (error) {
    redirect('/');
  }
}, [data, error, id]);


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <CourseContent id={id} user={data.user}/>
        </div>
      )}
    </>
  );
};

export default Page;
