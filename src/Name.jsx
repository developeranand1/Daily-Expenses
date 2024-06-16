import { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'; 
import Swal from 'sweetalert2';

const Name = () => {
    const [name, setName] = useState('');
    const [isNameStored, setIsNameStored] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
            setIsNameStored(true); // Set the flag if the name is stored
        }
    }, []);

    const handleChange = (e) => {
        setName(e.target.value);
        setError(''); // Clear any existing errors when the user starts typing
    };

    const handleSave = () => {
        if (name.length < 3) {
            setError('Name must be at least 3 characters long.');
            return;
        }

        localStorage.setItem('name', name);
        Swal.fire({
            icon: 'success',
            title: 'Saved',
            text: 'Your name has been successfully!.',
          });
        
        setIsNameStored(true); 
    };

    return (
        <div className="container mx-auto p-4">
            {isNameStored ? (
                <div className='px-2'>
                    <h3 className='font-bold py-2'>Hey, 🙋‍♂️</h3>
                    <h1 className="text-2xl font-bold flex" > <img src="/user.png" alt="" style={{paddingRight:"10px"}} />{name} </h1>
                </div>
            ) : (
                <div className="max-w-md mx-auto">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                    >
                        Your Name
                    </label>
                    <input
                        className="mb-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />
                    {error && <p className="text-red-500 text-xs italic mb-2">{error}</p>}
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="w-full text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

export default Name;
