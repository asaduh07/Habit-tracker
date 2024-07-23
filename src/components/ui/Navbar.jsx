import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authSelector, authActions } from '@/features/user/userReducer';
import config from '@/config/config';
import { useEffect, useState } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { loggedIn, user } = useSelector(authSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [navigation, setNavigation] = useState([
    { name: 'Home', href: '/', current: false },
    { name: 'Week view', href: '/week', current: false },
    { name: 'Add habit', href: '/add', current: false },
  ]);

  useEffect(() => {
    setNavigation(navigation.map(item => ({
      ...item,
      current: item.href === location.pathname,
    })));
  }, [location.pathname]);

  useEffect(() => {
    if (loggedIn) {
      if (location.pathname === "/signin" || location.pathname === "/signup") {
        navigate("/");
      }
    }
  }, [user, location.pathname, navigate, loggedIn]);

  const handleSignOut = () => {
    dispatch(authActions.signOut());
  };

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />
                <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <Link to={'/'}>
              <div className="flex flex-shrink-0 items-center space-x-2">
                <img alt="Your Company" src="/transparent_2024-07-17T18-26-07.png" className="h-auto w-10" />
                <h2 className='text-white'>Habit Tracker</h2>
              </div>
              </Link>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4 ">
                  {loggedIn ? navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={item.current ? 'page' : undefined}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium',
                      )}
                    >
                      {item.name}
                    </Link>
                  )) : null}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {loggedIn ? (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex space-x-2 items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {user ? (
                        <>
                          <div className='text-white'>{user.name}</div>
                          <img
                            alt="User avatar"
                            src={`${config.serverBaseUrl}${user.imageUrl}`}
                            className="h-10 w-10 rounded-full"
                          />
                        </>
                      ) : (
                        <div className='text-white'>Loading...</div>
                      )}
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <div onClick={handleSignOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                        Sign out
                      </div>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                null
              )}
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Outlet />
    </>
  );
}
