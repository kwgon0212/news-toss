import React from "react";
import SideMenus from "@/components/router/(main)/portfolio/SideMenus";
import { getJwtToken } from "@/utils/auth";

const PortfolioLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = await getJwtToken();

  return (
    <div className="px-[30px] flex gap-[40px]">
      {/* <aside className="flex flex-col gap-main">
        <SideMenus token={token} />
      </aside> */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default PortfolioLayout;
