import React, { ReactNode } from "react";
import "../../styles/layouts.css";
import Header from "@/app/components/Header";
import Sidebar from "../Sidebar";

type TDefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout = ({ children }: TDefaultLayoutProps) => {
  return (
    <div className='wrap-default-layout'>
      <Header />
      <Sidebar />
      <div className='main'>
        {children}
        <div className='footer mt-auto  py-3'>
          <p className='text-center' style={{ color: "#828282" }}>
            ©2021 Managed by PT. Bosnet Distribution Indonesia
          </p>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
