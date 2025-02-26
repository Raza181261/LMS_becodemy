// import React, { FC } from "react";
// import Image from "next/image";
// import { BiSearch } from "react-icons/bi";
// import Link from "next/link";

// type Props = {};

// const Hero: FC<Props> = (props) => {
//   return (
//     <div className="w-full 1000px:flex items-center">
//       <div className="absolute top-[100px] 1000px:top-[unset] 1500px:h-[700px] 1100px:h-[600px] h-[50vh] hero-animation rounded-full">
//         <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
//           <Image
//             src={require("../../../public/assests/banner-img-1.png")}
//             alt=""
//             className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
//           />
//         </div>
//         <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0] text-center 1000px:text-left mt-[150px]">
//             <h2 className="dark:text-white text-[#000000c7] text-[30px] px-3 w-full 1000px:text-[70px] font-[600] font-Josefin py-2 1000px:leading-[75px] 1500px:w-[600px]">
//                 Improve Your Online Learning Experience Better Instantly
//             </h2>
//             <br />
//             <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] 1500px:!w-[55%] 1100px:!w-[78%]">
//                 We have 40k+ Online courses & 500K+ Online registered student. Find
//                 your desired Courses from them. 
//             </p>
//             <br />
//             <br />
//             <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative">
//                 <input type="search" 
//                  placeholder="Search courses..."
//                  className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
//                 />
//                 <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
//                     <BiSearch className="text-white" size={30}/>
//                 </div>
//             </div>
//             <br />
//             <br />
//             <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
//                 <Image 
//                  src={require("../../../public/assests/client-1.jpg")}
//                  alt=""
//                  className="rounded-full"
//                 />
//                 <Image 
//                  src={require("../../../public/assests/client-2.jpg")}
//                  alt=""
//                  className="rounded-full ml-[-20px]"
//                 />
//                 <Image 
//                  src={require("../../../public/assests/client-3.jpg")}
//                  alt=""
//                  className="rounded-full ml-[-20px]"
//                 />
//                 <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] 1000px:pl-3 text-[18px] font-[600]">
//                     500K+ people already trusted us.{" "}
//                     <Link 
//                      href="/courses"
//                      className="dark:text-[#46e256] text-[crimson]"
//                     >
//                         View Courses
//                     </Link>{" "}
//                 </p>
//             </div>
//             <br />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;


import React, { FC } from "react";
import Image from "next/image";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full flex items-center flex-col-reverse 1000px:flex-row mt-[100px]">
      {/* Left Section - Image */}
      <div className="w-full 1000px:w-[50%] 1500px:h-[700px] 1100px:h-[600px] h-[30vh] flex items-center justify-center relative hero_animation rounded-full">
        <Image
          src={require("../../../public/assests/banner-img-1.png")}
          alt="Hero Image"
          className="object-contain w-[90%] 1100px:w-[85%] h-auto z-[10]"
        />
      </div>

      {/* Right Section - Content */}
      <div className="w-full 1000px:w-[50%] flex flex-col items-center 1000px:items-start text-center 1000px:text-left px-4 1000px:px-8">
        <h2 className="dark:text-white text-[#000000c7] text-[30px] 1000px:text-[50px] font-[600] font-Josefin py-2 leading-[1.2]">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <p className="dark:text-[#edfff4] text-[#000000ac] font-Josefin font-[600] text-[18px] mt-4 leading-[1.6]">
          We have 40k+ Online courses & 500K+ Online registered students. Find
          your desired Courses from them.
        </p>

        {/* Search Input */}
        <div className="w-full 1000px:w-[80%] h-[50px] bg-transparent relative mt-6">
          <input
            type="search"
            placeholder="Search courses..."
            className="bg-transparent border dark:border-none dark:bg-[#575757] dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2 w-full h-full outline-none text-[#0000004e] dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39c1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>

        {/* Clients Section */}
        <div className="flex items-center mt-6">
          <Image
            src={require("../../../public/assests/client-1.jpg")}
            alt="Client 1"
            className="rounded-full"
          />
          <Image
            src={require("../../../public/assests/client-2.jpg")}
            alt="Client 2"
            className="rounded-full ml-[-20px]"
          />
          <Image
            src={require("../../../public/assests/client-3.jpg")}
            alt="Client 3"
            className="rounded-full ml-[-20px]"
          />
          <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3] pl-3 text-[18px] font-[600]">
            500K+ people already trusted us.{" "}
            <Link
              href="/courses"
              className="dark:text-[#46e256] text-[crimson]"
            >
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
