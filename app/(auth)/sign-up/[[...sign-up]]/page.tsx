import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container-max py-10 flex justify-center">
      <SignUp routing="path" path="/sign-up" />
    </div>
  );
}


