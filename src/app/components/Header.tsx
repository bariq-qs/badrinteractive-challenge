import { Avatar, AvatarBadge, AvatarGroup, Stack } from "@chakra-ui/react";
import { useState } from "react";

const Header = () => {
  const [name, setName] = useState("Cooper Rosser");
  return (
    <header className='header p-3'>
      <p className=' font-bold'>My Brand</p>
      <Stack direction='row' className='gap-2 items-center'>
        <Avatar name={name} size='sm' bgColor='#1BA8DF' />
        <p className='text-sm'>{name}</p>
      </Stack>
    </header>
  );
};

export default Header;
