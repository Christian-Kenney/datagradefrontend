import React, { useState, useEffect, useRef } from 'react';
import './GradeBook.css'; // Import the CSS file
import { useUser} from "./UserContext";
import Chart from 'chart.js/auto'; // Import Chart.js
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';

const GradeBook = () => {
    const [user, setUser] = useState('John Doe');
    const [users, setUsers] = useState();
    const [classes, setClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState({});
    const userId = '1';
    const { loggedInUser } = useUser();
    const [studentDropdown, setStudentDropdown] = useState(null);
    let counter = 0;
    const chartRef = useRef(null);
    const [showGraph, setShowGraph] = useState(false);
    const navigate = useNavigate();
    const [showPieChart, setShowPieChart] = useState(false);
    const pieChartRef = useRef(null);
    const [classLevel, setClassLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);



    const handleLogout = () => {
        alert('Logout button clicked');
        navigate('/');
    };

    const handleShowPieChart = () => {
        setShowPieChart(true);
    };

    const handleClassChange = (event) => {
        const selectedClassObject = classes.find(classItem => classItem.subject === event.target.value);
        setSelectedClass(selectedClassObject);
        fetchAssignments()
        fetchStudents()
        fetchGrades()


    };

    const viewAssignments = (event) => {
        console.log("ASSIGNMENTS: ", assignments);
        console.log("selectedClass: ", selectedClass);
    }
    const printSelectedClass = () => {
        console.log("CLASS: ", selectedClass);
        console.log("Better class: ")
    }

    const findGrades = (event) => {

    }
    const handleAddStudent = () => {
        const usersNotEnrolled = Object.values(users).filter(user => user.roleId === 2 && !students.find(student => student.userId === user.userId && student.classId === selectedClass.classId));

        const studentOptions = usersNotEnrolled.map(user => (
            <option key={user.userId} value={user.userId}>{user.name}</option>
        ));

        const studentDropdown = (
            <select onChange={handleStudentSelection}>
                <option value="">Select a student</option>
                {studentOptions}
            </select>
        );

        setStudentDropdown(studentDropdown);
    };

    const handleCreateClass = async () => {
        console.log("LOGGED IN USER: ", loggedInUser);
        try {
            const response = await fetch('https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gradelevel: classLevel,
                    subject: subject,
                    teacher: loggedInUser.id
                    }),
            });
            if (!response.ok) {
                throw new Error('Failed to create class');
            }
            const newClass = await response.json();
            setClass([...classes, newClass]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Error creating class:', error);
        }
    };

    const handleShowGraph = () => {
        setShowGraph(true);
    };

    const handleCloseModal = () => {
        setShowGraph(false);
    };

    const handleStudentSelection = (event) => {
        const selectedStudentId = event.target.value;
        const selectedStudent = users[selectedStudentId];
        setStudents([...students, { userId: selectedStudent.userId, classId: selectedClass.classId }]);
        updateGradesForNewStudent(selectedStudent);
    };

    const handleAddAssignment = async () => {
        try {
            const response = await fetch('https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: 'CHANGE ME',
                classId: selectedClass.classId}),
            });
            if (!response.ok) {
                throw new Error('Failed to add assignment');
            }
            const newAssignment = await response.json();
            setAssignments([...assignments, newAssignment]);
            updateGradesForNewAssignment(newAssignment.name);
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };


    const updateGradesForNewStudent = (newStudent) => {
        const updatedGrades = { ...grades };
        updatedGrades[newStudent] = {};
        setGrades(updatedGrades);
    };

    const updateGradesForNewAssignment = (newAssignment) => {
        const updatedGrades = { ...grades };
        Object.keys(updatedGrades).forEach((student) => {
            updatedGrades[student][newAssignment] = '';
        });
        setGrades(updatedGrades);
    };

    const handleGradeChange = (student, assignment, event) => {
        const updatedGrades = { ...grades };
        updatedGrades[student] = {
            ...updatedGrades[student],
            [assignment]: event.target.value,
        };
        setGrades(updatedGrades);
    };


    const fetchUserById = async (userId) => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/users/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch userrrr');
            }
            const userData = await response.json();
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const usersData = await response.json();
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchClassByUserId = async () => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/class`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const classData = await response.json();
            console.log("HERERE: ", classData)
            setClass(classData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/assignment`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const assignmentData = await response.json();
            console.log("HERERE: ", assignmentData)
            setAssignments(assignmentData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/student`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const studentData = await response.json();
            console.log("HERERE: ", studentData)
            setStudents(studentData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    const fetchGrades = async () => {
        try {
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/grade`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const gradeData = await response.json();
            console.log("HERERE: ", gradeData)
            setGrades(gradeData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleLogUserData = () => {
        console.log(loggedInUser);
        fetchUserById(1);
        fetchUsers()
        fetchClassByUserId()


    };


    const handleAssignmentNameChange = async (index, newName) => {
        try {
            console.log("NEW NAME: ", newName);
            console.log("index: ", index);
            console.log("id: ", assignments[index].assignmentId);
            console.log("Assignments: ", assignments);
            const assId = assignments[index].assignmentId;
            const response = await fetch(`https://ec2-34-225-27-237.compute-1.amazonaws.com:8080/assignment/1`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) {
                throw new Error('Failed to update assignment name');
            }
            const updatedAssignment = await response.json();
            const updatedAssignments = [...assignments];
            updatedAssignments[index] = updatedAssignment;
            setAssignments(updatedAssignments);
        } catch (error) {
            console.error('Error updating assignment name:', error);
        }
    };
    useEffect(() => {
        // setUser(loggedInUser);
        // setUsers(loggedInUser);
        if(users){
            console.log('users data: ', users)
        }
        if (user) {
            console.log('User data:', user);
        }
        if(classes) {
            console.log('class data: ', classes)
        }
        if(assignments){
            console.log('assignment data: ', assignments)
        }
        if(students){
            console.log('student data: ', students)
        }
        if(grades){
            console.log('grade data: ', grades)
        }

        console.log("LOGGED IN: ", loggedInUser);

    }, [user, classes]);

    useEffect(() => {
        if(showGraph && chartRef && chartRef.current) {
            const prepareChartData = () => {
                const labels = ["As", "Bs", "Cs", "Ds", "Fs"];
                const data = [0, 0, 0, 0, 0];

                Object.values(grades).forEach(grade => {
                    const numericGrade = parseFloat(grade.grade);
                    if (numericGrade >= 90) {
                        data[0]++;
                    } else if (numericGrade >= 80 && numericGrade < 90) {
                        data[1]++;
                    } else if (numericGrade >= 70 && numericGrade < 80) {
                        data[2]++;
                    } else if (numericGrade >= 60 && numericGrade < 70) {
                        data[3]++;
                    } else {
                        data[4]++;
                    }
                });

                return { labels, data };
            };

            if (chartRef && chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                const {labels, data} = prepareChartData();
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Average Grade',
                            data: data,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    }, [showGraph, selectedClass, assignments, students, grades]);

    useEffect(() => {
        if (showPieChart && pieChartRef && pieChartRef.current) {
            const preparePieChartData = () => {
                const data = [0, 0, 0, 0, 0];

                Object.values(grades).forEach(grade => {
                    const numericGrade = parseFloat(grade.grade);
                    if (numericGrade >= 90) {
                        data[0]++;
                    } else if (numericGrade >= 80 && numericGrade < 90) {
                        data[1]++;
                    } else if (numericGrade >= 70 && numericGrade < 80) {
                        data[2]++;
                    } else if (numericGrade >= 60 && numericGrade < 70) {
                        data[3]++;
                    } else {
                        data[4]++;
                    }
                });

                return data;
            };

            if (pieChartRef && pieChartRef.current) {
                const ctx = pieChartRef.current.getContext('2d');
                const data = preparePieChartData();
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: ["As", "Bs", "Cs", "Ds", "Fs"],
                        datasets: [{
                            data: data,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Grade Distribution'
                            }
                        }
                    }
                });
            }
        }
    }, [showPieChart, grades]);
    return (
        <div className="gradebook">
            <header className="header">
                <h1 className="title">Datagrade</h1>
                <div className="user-info">
                    <span className="username">Welcome, {user.name}</span>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
                <div className="class-dropdown">
                    <select value={selectedClass ? selectedClass.subject : ""} onChange={handleClassChange}>
                        <option value="">Select a class</option>
                        {classes.map((classItem, index) => (
                            <option key={index} value={classItem.subject}>{classItem.subject}</option>
                        ))}
                    </select>
                    <button onClick={handleLogUserData}>Log User Data</button>
                    <button onClick={handleShowGraph}>Show Graph</button>
                    <button onClick={() => setShowCreateModal(true)}>Create Class</button>
                    {showGraph && (
                        <Modal onClose={handleCloseModal}>
                            <canvas ref={chartRef}></canvas>
                        </Modal>
                    )}
                    <button className="logout-btn" onClick={handleShowPieChart}>Show Pie Chart</button>
                    {showPieChart && (
                        <Modal onClose={() => setShowPieChart(false)}>
                            <canvas ref={pieChartRef}></canvas>
                        </Modal>
                    )}
                    {showCreateModal && (
                        <Modal onClose={() => setShowCreateModal(false)}>
                            <h2>Create New Class</h2>
                            <input
                                type="text"
                                placeholder="Class Level"
                                value={classLevel}
                                onChange={(e) => setClassLevel(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                            <button onClick={handleCreateClass}>Create</button>
                        </Modal>
                    )}

                </div>

            </header>
            <main className="main">
                <div className="controls">

                    {studentDropdown}
                    <button onClick={handleAddStudent}>Add Student</button>
                    <button onClick={handleAddAssignment}>Add Assignment</button>
                </div>

                <div className="grades">
                    <h2>Grades for {selectedClass ? selectedClass.subject : ''}</h2>
                    <table>
                        <thead>
                        <tr>
                            <th>Student</th>
                            {assignments
                                .filter(assignment => assignment.classId === selectedClass.classId)
                                .map((assignmentItem, index) => (
                                <th key={index}>
                                    <input
                                        type="text"
                                        value={assignmentItem.name}
                                        onChange={(event) => handleAssignmentNameChange(index, event.target.value)}
                                    />
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {students
                            .filter(student => student.classId === selectedClass.classId)
                            .map((studentItem, studentIndex) => {
                                let studentGrades = [];

                                return (
                                    <tr key={studentIndex}>
                                        <td>{users[studentItem.userId].name}</td>
                                        {assignments
                                            .filter(assignment => assignment.classId === selectedClass.classId)
                                            .map((assignment, assignmentIndex) => {
                                                let grade = '';


                                                let matchingGrades = grades.filter(grade =>
                                                    grade.assignmentId === assignment.assignmentId &&
                                                    grade.studentId === studentItem.studentUserId
                                                );


                                                grade = matchingGrades.length > 0 ? matchingGrades[0].grade : '';

                                                studentGrades.push(grade);

                                                return (
                                                    <td key={assignmentIndex}>
                                                        <input
                                                            type="text"
                                                            value={grade || ''}
                                                            onChange={(event) =>
                                                                handleGradeChange(studentItem, assignment, event)
                                                            }
                                                        />
                                                    </td>
                                                );
                                            })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default GradeBook;
