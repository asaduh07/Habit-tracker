
import { useDispatch,useSelector } from 'react-redux'
import { useRef, useState } from 'react';
import { addHabitAsync } from '@/features/habit/habitReducer';
import { authSelector } from '@/features/user/userReducer';
import { habitSelector } from '@/features/habit/habitReducer';
import Loader from '@/components/ui/loader/loader';
export default function Form() {
    let titleInput= useRef(null);
    let timeInput= useRef(null);
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const {user}=useSelector(authSelector);
    const {loading}=useSelector(habitSelector);
    

    const dispatch = useDispatch();

    function handleSubmit(e) {
        e.preventDefault(); 
        dispatch(addHabitAsync({ title, schedule: time,user:user._id }));
        setTitle('');
        setTime('');
        titleInput.current.value = '';
        timeInput.current.value = '';
        
    }
    return (
        
        <>

            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Add a new habit
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form  className="space-y-6" onSubmit={(e) => { handleSubmit(e) }}>
                        <div >
                            <div className="flex items-center justify-between">
                                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                    Habit
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    // autoComplete="email"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={(e) => setTitle(e.target.value)} value={title} ref={titleInput}/>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="time" className="block text-sm font-medium leading-6 text-gray-900">
                                Time
                                </label>
                                <div className="text-sm">
                                    {/* <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a> */}
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="time"
                                    name="time"
                                    type="time"
                                    required
                                    // autoComplete="current-password"
                                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" onChange={(e) => setTime(e.target.value)} value={time} ref={timeInput}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {loading?<Loader/>:"Add"}
                            </button>
                        </div>
                    </form>

                    
                </div>
            </div>
        </>
    )
}