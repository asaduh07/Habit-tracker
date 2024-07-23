import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAndUpdateAllHabits } from "@/features/habit/habitReducer";
import { habitSelector } from "@/features/habit/habitReducer";
import WeekCard from "@/components/ui/WeekCard/weekCard";
import Loader from "@/components/ui/loader/loader";
export default function Weekview() {
    const dispatch = useDispatch();
    const { habits,loading } = useSelector(habitSelector);
    
    useEffect(() => {
        dispatch(fetchAndUpdateAllHabits());
    }, [dispatch]);
    


    return (
        loading ? (
            <div className="flex bg-neutral-100 justify-center items-center min-h-screen">
                <Loader />
            </div>
        ) : (
            <div className="space-y-6 p-4">
                {Array.isArray(habits) && habits.length > 0 ? (
                        habits.map((habit) => (
                            <WeekCard habit={habit} key={habit._id} />
                        ))
                    ) : (
                        <div className="flex justify-center my-80 items-center w-full">
                            <h1 className="text-gray-500">No habits</h1>
                        </div>
                    )}
            </div>
        )
    )
}