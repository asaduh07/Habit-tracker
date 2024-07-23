import DetailCard from '@/components/ui/Detail Card/detailCard';
import { habitSelector } from '../../features/habit/habitReducer';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { fetchAndUpdateAllHabits } from '../../features/habit/habitReducer';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/ui/modal';
import Loader from '@/components/ui/loader/loader';
export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { habits, loading } = useSelector(habitSelector);

    useEffect(() => {
        dispatch(fetchAndUpdateAllHabits());
    }, [dispatch])


    return (
        loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <Loader />
            </div>
        ) : (
            <>
                <Modal />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {Array.isArray(habits) && habits.length > 0 ? (
                        habits.map((habit) => (
                            <DetailCard habit={habit} key={habit._id} />
                        ))
                    ) : (
                        <div className="col-span-1 sm:col-span-2  my-40 lg:col-span-3 flex justify-center items-center h-full">
                            <h1 className="text-gray-500">No habits</h1>
                        </div>
                    )}
                </div>

            </>
        )
    )
}