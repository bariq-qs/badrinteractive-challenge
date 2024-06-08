import { faClipboardList, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [menus, setMenus] = useState([
    {
      label: "Order Management",
      route: "/order-management",
      icon: faClipboardList,
    },
  ]);
  return (
    <div className='sidebar'>
      <div className='main'>
        {menus.map((menu, menuIdx) => (
          <Link
            href={menu.route}
            className={`wrap-menu flex py-3 ${
              router.pathname.includes(menu.route) ? `active` : ""
            }`}
            key={menuIdx}
          >
            <div className='flex gap-3 px-4 items-center'>
              <FontAwesomeIcon icon={menu.icon} className='text-white' />
              <p className='font-medium text-sm text-white'>{menu.label}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className='footer'>
        <div className='flex gap-4'>
          <FontAwesomeIcon icon={faEnvelope} className='text-white' />
          <div>
            <p className='text-sm' style={{ color: "#E0E0E0" }}>
              Support
            </p>
            <p className='text-sm text-white font-medium'>cs@bosnet.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
