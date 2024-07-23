import './App.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navbar from './components/ui/Navbar';
import Signin from './pages/signin/signin';
import Signup from './pages/signup/signup';
import Home from './pages/home/home';
import Weekview from './pages/WeekView/weekview';
import Form from './pages/HabitForm/habitForm';
import Profile from './pages/profile/profile';
import { authActions, fetchUserDetailsAsync } from './features/user/userReducer';
import { authSelector } from './features/user/userReducer';
import {jwtDecode} from 'jwt-decode';

function App() {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector(authSelector);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (token) {
      try {
        const parsedToken = JSON.parse(token);

        if (typeof parsedToken === 'string') {
          const decodedToken = jwtDecode(parsedToken);

          // Check if the token is expired
          const currentTime = Date.now() / 1000; // Current time in seconds
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            // Token is expired
            dispatch(authActions.signOut());
          } else {
            // Fetch user details
            dispatch(fetchUserDetailsAsync()).then((action) => {
              if (fetchUserDetailsAsync.fulfilled.match(action)) {
                dispatch(authActions.setUser(action.payload));
              } else {
                dispatch(authActions.signOut());
              }
            });
          }
        }
      } catch (e) {
        console.error('Error parsing token:', e);
        dispatch(authActions.signOut());
      }
    } else {
      dispatch(authActions.signOut());
    }
  }, [dispatch]);

  const PrivateRoute = ({ children }) => {
    if (!loggedIn) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <Navbar />,
      children: [
        { index: true, element: <PrivateRoute><Home /></PrivateRoute> },
        { path: "/signin", element: <Signin /> },
        { path: "/signup", element: <Signup /> },
        { path: "/week", element: <PrivateRoute><Weekview /></PrivateRoute> },
        { path: "/add", element: <PrivateRoute><Form /></PrivateRoute> },
        { path: "/profile", element: <PrivateRoute><Profile /></PrivateRoute> },
      ],
    },
  ]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
