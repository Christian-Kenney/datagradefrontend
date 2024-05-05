import React, { useState } from 'react';

const GradeModal = ({ onClose, onSubmit }) => {
    const [newGrade, setNewGrade] = useState('');

    const handleSubmit = () => {
        onSubmit(newGrade);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Update Grade</h2>
                <label>New Grade:</label>
                <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default GradeModal;