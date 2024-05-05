import React, { useState } from 'react';

const AssignmentModal = ({ onClose, onSubmit }) => {
    const [newAssignment, setNewAssignment] = useState('');

    const handleSubmit = () => {
        console.log("NA: ", newAssignment);
        onSubmit(newAssignment);
        onClose();
    };

    return (
        <div className="registration-modal-container">
            <div className="registration-modal-content">
                <h2>Update Assignment</h2>
                <label>New Name:</label>
                <input
                    type="text"
                    value={newAssignment}
                    onChange={(e) => setNewAssignment(e.target.value)}
                />
                <button onClick={handleSubmit} className="registration-modal-submit">Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default AssignmentModal;