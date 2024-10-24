import { useState, useEffect } from "react";
import { ApplicationLogo } from "./ApplicationLogo";
import LinkButton from "./LinkButton";
import EkiliRelay from "ekilirelay";

const Header = () => {
 
  return (
    <header className="w-full p-6 flex justify-between ">
      <div className="flex items-center">
        <a href="./" className="flex gap-2 items-center text-neutral-200">
          <ApplicationLogo className="block h-8 w-8 fill-current" />
          <h1 className="font-bold text-4xl">ServerControl</h1>
        </a>
      </div>

      <div className="flex gap-4 items-center">
        
        <LinkButton to="/about">About</LinkButton>
      </div>
    </header>
  );
};

export default Header;
