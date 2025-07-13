import { useGetCourseContentQuery } from '@/redux/features/courses/coursesApi'
import React, { useState } from 'react'
import Loader from '../Loader/Loader'
import Heading from '@/app/utils/Heading'

type Props = {
    id : string
}

const CourseContent = ({id}: Props) => {
    const {data:contentData,isLoading} = useGetCourseContentQuery(id);
    const data = contentData?.content;

    // const [activeVideo, setActiveVideo] = useState(0);

  return (
    <>
     {
        isLoading ? (
            <Loader/>
        ) : (
            <div className='w-full grid 800px:grid-cols-10'>
                 {/* <Heading
                   title={data[activeVideo]?.title}
                   description='an overview of the course content'
                   keywords={data[activeVideo]?.tags}
                 /> */}
                 <h1>Hello world</h1>
            </div>
            
        )
     }
    </>
  )
}

export default CourseContent