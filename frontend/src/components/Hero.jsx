import { Link } from "react-router-dom";

const Hero = ({ user, resendEmail }) => {
  return (
    <div className="py-16 w-[90%] md:max-w-xl lg:max-w-2xl xl:max-w-2xl mx-auto">
      <div className=" flex flex-col justify-center items-center gap-5">
        <h1 className=" text-4xl font-semibold text-center md:text-start antialiased">
          Please verify your email...
        </h1>

        <div className="flex items-center justify-center">
          <img
            src="https://ouch-cdn2.icons8.com/YnDSXUo3A7nO4ZhxbyFc4onJqG8LfIGcrl3FwtWpj7w/rs:fit:368:305/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTE0/L2I3NGE3ZjVhLWNk/ZjQtNGY0Yy05ODI0/LWJlZTgwNTg0NmE0/OS5zdmc.png"
            alt=""
            className=" w-[50%]"
          />
        </div>

        <div className=" font-[600] flex flex-col items-center justify-start md:justify-center gap-4">
          <h3 className=" text-pink-500">
            Please verify your email address. We've sent a confirmation email
            to:
          </h3>
          <p className=" font-semibold text-[14px] md:text-[18px]">
            {user.email}
          </p>
          <h3 className="text-pink-500 text-[12px] md:text-[16px]">
            Click the confirmation link in that email to begin using Dribble.
          </h3>

          <h3 className=" text-[14px] md:text-[16px] md:text-center text-pink-500">
            Did'nt receive the Email? Check your Spam folder, it may have been
            caught by a filter.if you still don't see, You can{" "}
            <button
              onClick={resendEmail}
              to=""
              className=" font-semibold text-black"
            >
              resend the confirmation email.
            </button>
          </h3>
          <h3 className=" text-[14px] md:text-[16px] text-pink-500">
            Wrong email address?{" "}
            <Link to="" className=" font-semibold text-pink-600">
              Change it.
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Hero;
