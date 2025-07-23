import { styles } from "../styles/style";

type Props = {};

const Policy = (props: Props) => {
  return (
    <div className="w-[95%] 800px:w-[92%] m-auto py-2 text-black dark:text-white px-3">
      <br />
      <br />
      <h1 className={`${styles.title} !text-start pt-2`}>
        Privacy Policy - ELearning
      </h1>
      <ul style={{ listStyle: "unset", marginLeft: "15px" }}>
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          Users are expected to engage with the platform in a respectful and
          responsible manner. All content shared, including discussion posts and
          comments, must adhere to professional standards and avoid offensive
          language, plagiarism, or copyright violations. Any attempt to misuse
          the platform, including hacking, distributing malware, or unauthorized
          sharing of content, will lead to suspension or termination of access.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          We prioritize the privacy of our users and comply with all applicable
          data protection regulations. Personal information collected during
          registration and course participation will only be used to provide
          educational services and improve user experience. The platform ensures
          secure storage of user data and will not share personal details with
          third parties without explicit consent, except where required by law.
        </p>
        <br />
        <p className="py-2 ml-[-15px] text-[16px] font-Poppins leading-8 whitespace-pre-line">
          All course materials, including videos, documents, and assessments,
          are the intellectual property of the platform or its content creators.
          Users are granted a non-transferable, limited license to access and
          use the content for personal learning purposes only. Unauthorized
          distribution, reproduction, or commercial use of the platform
          content is strictly prohibited and may result in legal action.
        </p>
      </ul>
      <br />
      <br />
    </div>
  );
};

export default Policy;
