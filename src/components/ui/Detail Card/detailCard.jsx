import { useEffect, useState } from 'react';
import { updateFavoriteAsync } from '@/features/habit/habitReducer';
import { useDispatch, useSelector } from 'react-redux';
import { habitSelector } from '@/features/habit/habitReducer';
import Options from '../optionDropdown';
import Modal from '../modal';
import { deleteHabitAsync } from '@/features/habit/habitReducer';
import { updateHabitAsync } from '@/features/habit/habitReducer';

const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
};

export default function DetailCard({ habit }) {
    const {
        title = '',
        scheduledTime = '',
        fav = false,
        currentStreak = 0,
        bestStreak = 0,
        totalDays = 0,
        statuses = [],
        _id,
    } = habit || {};
    const dispatch = useDispatch();
    const{loading}=useSelector(habitSelector);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const [newSchedule, setNewSchedule] = useState(convertTo24HourFormat(scheduledTime))
    
    

    const [favorite, setFavorite] = useState(fav);

    const handleToggleFavorite = () => {
        const newFavStatus = !favorite;
        setFavorite(newFavStatus); 
        dispatch(updateFavoriteAsync({ id: _id, fav: newFavStatus }));
    };
    useEffect(() => {
        setFavorite(fav);
    }, [fav]);

    const handleEditClick = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleDelete = () => {
        dispatch(deleteHabitAsync({_id}));
        setDeleteModalOpen(false);
    };

    const handleUpdate = () => {
        dispatch(updateHabitAsync({ title: newTitle, schedule: newSchedule, _id }));
        setModalOpen(false);
    };

    return (
        <>
            <div className="bg-neutral-100 shadow-lg rounded-lg p-4 mb-4 group">
                <div className="flex justify-end items-center  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Options handleEditClick={handleEditClick} handleOpenDeleteModal={handleOpenDeleteModal} />
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    <div className="text-gray-600">{scheduledTime}</div>
                </div>
                <div className="flex justify-end mb-4">
                    <button onClick={handleToggleFavorite}>
                        <img
                            src={favorite ? 'https://cdn-icons-png.flaticon.com/128/1828/1828884.png' : 'https://cdn-icons-png.flaticon.com/128/1828/1828970.png'}
                            alt="favorite"
                            className="w-6 h-6"
                        />
                    </button>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>{currentStreak} Day(s) streak</span>
                    <span>{bestStreak} best</span>
                    <span>{totalDays}/{statuses.length} days</span>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} >
                <h1 className='font-bold'>Edit</h1>
                <div className="flex justify-between w-full space-x-4 my-2">

                    <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        value={newTitle}
                        autoComplete="title"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                        id="schedule"
                        name="schedule"
                        type="time"
                        required
                        value={newSchedule}
                        autoComplete="title"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => setNewSchedule(e.target.value)}
                    />
                </div>
                <div className='flex justify-end'>
                    <button onClick={handleCloseModal} className="text-right m-2 p-2 rounded-sm bg-slate-100">Cancel</button>
                    <button className="text-right m-2 p-2 rounded-sm bg-indigo-600 text-white" onClick={handleUpdate}>Update</button>
                </div>

            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
                <h1 className='font-bold'>Delete </h1>
                <p>Are you sure you want to delete this habit?</p>
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="bg-gray-300 text-black rounded-md px-4 py-2" onClick={handleCloseDeleteModal}>Cancel</button>
                    <button className="bg-red-600 text-white rounded-md px-4 py-2" onClick={handleDelete}>Delete</button>
                </div>
            </Modal>
        </>
    );
}
