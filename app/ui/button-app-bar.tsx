"use client"

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

export default function ButtonAppBar() {
  const pathname = usePathname();
  const queryClient = new QueryClient();

  return (
    <Box sx={{ flexGrow: 1 }}>
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
              className={pathname=='/' ? 'font-extrabold' : 'text-zinc-300'}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Home
              </Typography>
            </Link>
            <Link
              key="explore"
              href="/explore"
              className={pathname=='/explore' ? 'font-extrabold' : 'text-zinc-300'}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Explore
              </Typography>
            </Link>
            <Link
              key="rss"
              href="/rss"
              className={pathname=='/rss' ? 'font-extrabold' : 'text-zinc-300'}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                RSS
              </Typography>
            </Link>
          </div>
          {/* <Button color="inherit">Login</Button> */}
          <div className='flex flex-row'>
            <div className='px-3 self-center'>
              <QueryClientProvider client={queryClient}>
                <WeatherCurrent />
              </QueryClientProvider>
            </div>
            <Image
              src="/lulu.jpg"
              alt="lulu's cartoon pic"
              width={1024}
              height={1024}
              priority
              className="w-9 h-9 rounded-full"
            />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
