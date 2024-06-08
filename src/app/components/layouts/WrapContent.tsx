import { Card, CardBody } from "@chakra-ui/react";
import { ReactNode } from "react";

type TWrapContentProps = {
  title: string;
  children: ReactNode;
};
const WrapContent = ({ title, children }: TWrapContentProps) => {
  return (
    <div>
      <p className='text-center font-bold text-2xl mt-6 mb-10'>{title}</p>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
};

export default WrapContent;
