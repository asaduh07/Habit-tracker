import { useState } from 'react';
import { changeStatusAsync } from '@/features/habit/habitReducer';
import { useDispatch } from 'react-redux'
import Loader from '../loader/loader';
export default function DateCard({habitId, day}) {
    
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    async function handleChange(currentStatus) {
        setLoading(true);
        const newStatus = currentStatus === 'done' ? 'notDone' : 'done';
        try {
            await dispatch(changeStatusAsync({ habitId, dateId:day._id,status:newStatus }));
        } catch (error) {
            console.error("Failed to change status:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        loading ? <Loader /> : (
            <div
                className={`p-4 rounded-lg cursor-pointer text-center border 
                ${day.status === 'done' ? 'border-green-500 text-green-500' : day.status === 'notDone' ? 'border-red-500 text-red-500' : 'border-gray-300 text-gray-500'}`}
                onClick={() => handleChange(day.status)}
            >
                <div className="text-lg font-bold">{day.day}</div>
                <div className="text-sm">{day.date.split('T')[0].split('-')[2] + '/' + day.date.split('T')[0].split('-')[1]}</div>
            </div>
        )
    )
}