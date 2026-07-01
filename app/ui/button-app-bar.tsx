"use client";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import WeatherCurrent from '../weather/weather-current';
import Weather from '../weather/weather';
import { useState } from 'react';

export default function ButtonAppBar() {
  const pathname = usePathname();
  const queryClient = new QueryClient();
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleClick = () => {
    showWeatherDetails == true ? setShowWeatherDetails(false) : setShowWeatherDetails(true)
  };

  const handleLogin = () => {
    isLoggedIn == true ? setIsLoggedIn(false) : setIsLoggedIn(true)
  }

  return (
    <>
      <Box>
        <AppBar position="static" color="success">
          <Toolbar className='flex flex-row justify-between'>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
            <div className='flex flex-row gap-3'>
              <Link
                key="home"
                href="/"
                className={pathname=='/' ? 'font-extrabold' : 'text-zinc-300 hover:text-white'}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Home
                </Typography>
              </Link>
              <Link
                key="explore"
                href="/explore"
                className={pathname=='/explore' ? 'font-extrabold' : 'text-zinc-300 hover:text-white'}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Explore
                </Typography>
              </Link>
              <Link
                key="rss"
                href="/rss"
                className={pathname=='/rss' ? 'font-extrabold' : 'text-zinc-300 hover:text-white'}
              >
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  RSS
                </Typography>
              </Link>
            </div>
            <div className='flex flex-row'>
              <button className='self-center cursor-pointer hover:bg-green-700 px-5 rounded-4xl hover:shadow-lg/15' onClick={handleClick}>
                <QueryClientProvider client={queryClient}>
                  <WeatherCurrent />
                </QueryClientProvider>
              </button>
              {!isLoggedIn && <Button color="inherit" onClick={handleLogin}>Login</Button>}
              { isLoggedIn && 
                <button onClick={handleLogin} className='hover:cursor-pointer'>
                  <Image
                    src="/lulu.jpg"
                    alt="lulu's cartoon pic"
                    width={1024}
                    height={1024}
                    priority
                    className="w-9 h-9 rounded-full"
                  />
                </button>
              }
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      { showWeatherDetails && <Weather /> }
    </>
  );
}
