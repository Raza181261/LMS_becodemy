import { styles } from "@/app/styles/style";
import Image from "next/image";
import React from "react";
import ReviewCard from "../Review/ReviewCard";
// import studyImage from "../../../public/assets/study3.jpg";

type Props = {};

export const reviews = [
  {
    name: "Laura Miller",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    profession: "Software Engineer | Web Developer | Canada",
    comment:
      "Good Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this! Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!",
  },
  {
    name: "Buttler",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    profession: "UI/UX Designer | USA",
    comment:
      "Good Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this! Ahh gotcha now — you're saying the reviews look messy, especially due to those negative margins on the 3rd and 6th children — which visually break the grid spacing. Ahh gotcha now — you're saying the reviews look messy, especially due to those negative margins on the 3rd and 6th children — which visually break the grid spacing.",
  },
  {
    name: "Mina sento",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    profession: "Software Engineer | Web Developer | Canada",
    comment:
      "Good Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!",
  },
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    profession: "Student of CS | Cambridge University",
    comment:
      "Ahh gotcha now — you're saying the reviews look messy, especially due to those negative margins on the 3rd and 6th children — which visually break the grid spacing.  Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!Good",
  },
  {
    name: "Jay Gibbs",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    profession: "Junior Software Engineer| Indonesia",
    comment: "Good",
  },
  {
    name: "Verna Santos",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    profession: "Junior web developer | Japan",
    comment:
      " Let me know if you want help targeting specific child elements based on screen size or if you want a cleaner way to do this!Good",
  },
];

const Reviews = (props: Props) => {
  return (
    <div className="w-[90%] 800px:w-[85%] m-auto">
      <div className="w-full 800px:flex items-center">
        <div className="800px:w-[50%] w-full">
          <Image
            src={require("../../../public/assests/study3.jpg")}
            alt="business"
            width={500}
            height={500}
          />
        </div>
        <div className="800px:w-[50%] w-full">
          <h3 className={`${styles.title} 800px:!text-[40px]`}>
            Our Students Are{" "}
            <span className="text-indigo-700">Our strength</span> <br />
            See What They Say About Us
          </h3>
          <br />
          <p className={styles.label}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel vitae
            odit exercitationem fuga aspernatur hic error enim. Hic,
            perspiciatis aspernatur omnis quis a autem adipisci beatae molestias
            ipsa quam facilis!
          </p>
        </div>
        <br />
        <br />
      </div>
      <div className="grid grid-cols-1 gap-[25px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-2 lg:gap-[25px] xl:grid-cols-2 xl:gap-[35px] mb-12 border-0 md:[&>*:nth-child(3)]:!mt-[-60px] md:[&>*:nth-child(6)]:!mt-[-40px] ">
        {reviews &&
          reviews.map((i, index) => <ReviewCard item={i} key={index} />)}
      </div>
    </div>
  );
};

export default Reviews;
