
import DateCard from '../dateCard/datecard';

export default function WeekCard({ habit }) {
    // Provide default values if habit or habit.statuses is undefined
    const { title = '', schedule = '', statuses = [] } = habit || {};

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <div className="text-gray-600">{schedule}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {statuses.map((day) => (
                    <DateCard day={day} key={day._id} habitId={habit._id} />
                ))}
            </div>
        </div>
    );
}
