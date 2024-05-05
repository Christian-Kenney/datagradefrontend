import React, { useState } from 'react';

const StudentModal = ({ selectedClass, students, onClose, onSelectStudent, onSubmit }) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');

    console.log("MODAL");
    console.log(students);
    console.log("SC: ", selectedClass);
    const handleSelectChange = (event) => {

        const selectedId = event.target.value;
        setSelectedStudentId(selectedId);
        onSelectStudent(selectedId);
        console.log("SI: ", selectedStudentId);
        console.log("SC222: ", selectedClass);
    };

    const handleSubmit = async () => {
        const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: selectedStudentId,
                classId: selectedClass.classId
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to create student');
        }else{
            alert('Created Student, reload page!');
        }
    };

    return (
        <div className="registration-modal-container">
            <div className="registration-modal-content">
                <span className="registration-close" onClick={onClose}>&times;</span>
                <h2>Add Student</h2>
                <select onChange={handleSelectChange}>
                    <option value="">Select a student</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                </select>
                <button onClick={handleSubmit} className="registration-modal-submit">Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default StudentModal;