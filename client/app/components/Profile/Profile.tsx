"use client";
import React, { FC, useEffect, useState } from "react";
import SideBarProfile from "./SideBarProfile";
import { useLogOutQuery } from "../../../redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import ProfileInfo from "./ProfileInfo";
import ChangePassword from "./ChangePassword";
import CourseCard from "../Course/CourseCard";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";

type Props = {
  user: any;
  // user: {
  //   id: string;
  //   name: string;
  //   email: string;
  //   avatar: string | null;

  // } | null;
};

const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [active, setActive] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [logout, setLogout] = useState(false);
  const [courses, setCourses] = useState([]);

  const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});

  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  const logOutHandler = async () => {
    setLogout(true);
    await signOut();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  useEffect(() => {
    if (data) {
      const filteredCourses = user.courses
        .map((userCourse: any) =>
          data.courses.find((course: any) => course._id === userCourse._id)
        )
        .filter((course: any) => course !== undefined);
      setCourses(filteredCourses);
    }
  }, [data, user.courses]);
  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] stick ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>

      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo avatar={avatar} user={user} />
        </div>
      )}

      {active === 2 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ChangePassword />
        </div>
      )}

      {/* {active === 3 && (
        <div className="w-full pl-7 px-2 800px:px-10 800px:pl-8">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px]  lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-3 xl:gap-[35px]">
            {courses &&
              courses.map((item: any, index: number) => (
                <CourseCard
                  item={item}
                  key={index}
                  // user={user}
                  isProfile={true}s
                />
              ))}
          </div>
          {courses.length === 0 && (
            <h1 className="text-center text-[18px] font-Poppins">
              You don&apos;t have any purchased courses!
            </h1>
          )}
        </div>
      )} */}

      {active === 3 && (
        <div className="w-full bg-transparent mt-[80px]">
          <div className="px-4 sm:px-6 md:px-8">
            <h2 className="text-[24px] font-semibold mb-6 text-center md:text-left">
              My Courses
            </h2>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 xl:grid-cols-3">
              {courses && courses.length > 0 ? (
                courses.map((item: any, index: number) => (
                  <CourseCard item={item} key={index} isProfile={true} />
                ))
              ) : (
                <div className="col-span-full text-center">
                  <h1 className="text-[18px] font-Poppins text-gray-500">
                    You don&apos;t have any purchased courses!
                  </h1>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
