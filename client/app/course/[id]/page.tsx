// 'use client'
// import React from "react"
// import CourseDetailsPage from "../../components/Course/CourseDetailsPage";


// const Page = ({params}:any) => {
    
//     return (
//         <div>
//             <CourseDetailsPage id={params.id}/>
//         </div>
//     )
// }

// export default Page

// import React from "react";
// import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

// type Props = {
//   params: {
//     id: string;
//   };
// };

// const Page = ({ params }: Props) => {
//   return (
//     <div>
//       <CourseDetailsPage id={params.id} />
//     </div>
//   );
// };

// export default Page;

'use client';
import React from "react";
import { use } from "react"; // <-- import use()
import CourseDetailsPage from "../../components/Course/CourseDetailsPage";

const Page = ({ params }: any) => {
  const unwrappedParams = use(params); // <-- unwrap params

  return (
    <div>
      <CourseDetailsPage id={unwrappedParams.id} />
    </div>
  );
};

export default Page;

