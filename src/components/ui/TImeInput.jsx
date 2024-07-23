import React from 'react';

const convertTo24HourFormat = (time12h) => {
    if (!time12h) return '';

    const [time, modifier] = time12h.split(' ');
    if (!time || !modifier) return '';

    let [hours, minutes] = time.split(':');
    if (!hours || !minutes) return '';

    if (hours === '12') {
        hours = '00';
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

const convertTo12HourFormat = (time24h) => {
    if (!time24h) return '';

    let [hours, minutes] = time24h.split(':');
    if (!hours || !minutes) return '';

    const modifier = hours >= 12 ? 'PM' : 'AM';
    hours = (hours % 12) || 12;
    return `${hours}:${minutes} ${modifier}`;
};

export default function TimeInput({ time12h, onChange }) {
    const [time24h, setTime24h] = React.useState(convertTo24HourFormat(time12h));

    React.useEffect(() => {
        setTime24h(convertTo24HourFormat(time12h));
    }, [time12h]);

    const handleChange = (e) => {
        setTime24h(e.target.value);
        onChange(convertTo12HourFormat(e.target.value));
    };

    return (
        <input
            type="time"
            value={time24h}
            onChange={handleChange}
            className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
    );
}
