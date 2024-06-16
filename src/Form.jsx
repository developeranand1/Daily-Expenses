import { useEffect } from "react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import Swal from 'sweetalert2';
import jsPDF from "jspdf";
import { FiDownload } from "react-icons/fi";
import "jspdf-autotable";



const Form = () => {
  const formData = {
    product: "",
    price: "",
    date: "",
  };
  const [person, setPerson] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [totalPrice, setTotalPrice]=useState(0);

  const [people, setPeople] = useState(() => {
    const saveData = localStorage.getItem("peoples");
    return saveData ? JSON.parse(saveData) : [];
  });

  useEffect(() => {
    localStorage.setItem("peoples", JSON.stringify(people));
    setTotalPrice(calculateTotalPrice());
  }, [people]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPerson({ ...person, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatePeople = people.map((p, index) =>
        index === currentIndex ? person : p
      );
      setPeople(updatePeople);
      setIsEditing(false);
      setCurrentIndex(null);
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Your entry has been updated.',
      });
    } else {
      setPeople([...people, person]);
      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Your entry has been saved.',
      });
    }
    setPerson(formData);
  };

  const handleRemove = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        const updateData = people.filter((_, i) => i !== index);
        setPeople(updateData);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your entry has been deleted.',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your entry is safe :)',
          'error'
        );
      }
    });
  };

  const handleEdit = (index) => {
    // Show confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to edit this entry?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      // If user confirms, proceed with edit
      if (result.isConfirmed) {
        setPerson(people[index]);
        setIsEditing(true);
        setCurrentIndex(index);
      }
    });
  };


  const calculateTotalPrice=() => {
    return people.reduce((total, item) => {
      return total + parseFloat(item.price || 0);
    }, 0).toFixed(2)
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    const userName=localStorage.getItem("name") || "User"

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20,184,166); 
   

    doc.text(`Daily Expenses for ${userName}`, doc.internal.pageSize.getWidth() / 2, 16, { align: "center" });

    const tableColumn =["Sr.No.","Product Name", "Price", "Date"];
    const tableRows=[];
    people.forEach((person,index) => {
      const personData=[
        index +1,
        person.product,
       `${ person.price}`,
        person.date,
      ];
      tableRows.push(personData);
    });

    doc.autoTable(tableColumn, tableRows,{startY:20}),

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black colo

    doc.text(`Total Expenses :  ${calculateTotalPrice()}`,14,  doc.autoTable.previous.finalY +10);
    doc.save("expenses.pdf");
  };


  return (
    <>
    <div className="flex flex-col items-center justify-center px-2 sm:px-6 lg:px-8">
    {totalPrice > 0 && (
          <button
            onClick={downloadPDF}
            className="download flex items-center text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mt-2"
          >
            <FiDownload className="mr-2" />
            <span>Invoice</span>
          </button>
        )}
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full">
          <thead>
            <tr className="border">
              <th className="px-4 border py-2">#</th>
              <th className="px-4 border py-2">Products</th>
              <th className="px-4 border py-2">Price</th>
              <th className="px- border py-2">Date</th>
              <th className="px-4 border py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {people.length > 0 ? (
              people.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.product}</td>
                  <td className="border px-4 py-2">{item.price}</td>
                  <td className="border px-4 py-2">{item.date}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleRemove(index)}
                      className="mr-2 text-red-500 hover:text-red-700"
                    >
                      <lord-icon
                        className="text-red-700"
                        src="https://cdn.lordicon.com/skkahier.json"
                        trigger="hover"
                        style={{ width: "20px", height: "20px", color: "red" }}
                      ></lord-icon>
                    </button>
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                  </td>
                  
                </tr>
               
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2 text-center" colSpan="5">
                  No Daily Expenses Data Available
                </td>
              </tr>
             
            )}
          </tbody>
          
        </table>
        <div className=" mt-4">
            <strong>Total Expenses : ₹ {calculateTotalPrice()}</strong>
          </div>

      </div>
      <div className="w-full max-w-xs mt-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="product"
            >
              Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="product"
              type="text"
              name="product"
              value={person.product}
              onChange={handleInputChange}
              placeholder="Enter Product Name"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="text"
              name="price"
              value={person.price}
              onChange={handleInputChange}
              placeholder="Enter Price"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              name="date"
              value={person.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-center justify-between text-center">
            <button
              type="submit"
              className="text-white w-full bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mt-2">

              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default Form;
