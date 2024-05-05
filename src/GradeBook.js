import React, { useState, useEffect, useRef } from 'react';
import './GradeBook.css'; // Import the CSS file
import { useUser} from "./UserContext";
import Chart from 'chart.js/auto'; // Import Chart.js
import Modal from "./Modal";
import { useNavigate } from 'react-router-dom';
import GradeModal from "./GradeModal";
import StudentModal from "./StudentModal";

const GradeBook = () => {
    const [isLoading, setIsLoading] = useState(true);
    const loadingCounter = useRef(0);
    const [user, setUser] = useState('John Doe');
    const [users, setUsers] = useState();
    const [classes, setClass] = useState([]);
    const [selectedClass, setSelectedClass] = useState(classes[0]);
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState({});
    const userId = '1';
    const { loggedInUser } = useUser();
    const [studentDropdown, setStudentDropdown] = useState(null);
    let counter = 0;
    const chartRef = useRef(null);
    const [showGraph, setShowGraph] = useState(false);
    const [showGraph2, setShowGraph2] = useState(false);
    const navigate = useNavigate();
    const [showPieChart, setShowPieChart] = useState(false);
    const pieChartRef = useRef(null);
    const [classLevel, setClassLevel] = useState('');
    const [subject, setSubject] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [rawGrades, setRawGrades] = useState();
    let loadedGrades;
    let classGrades = [];
    const [stateClassGrades, setClassGrades] = useState([]);
    const [gradeIdCounter, setGradeIdCounter] = useState(0);
    const [showGradeModal, setShowGradeModal] = useState(false);
    let [gradeUpdateStudent, setGradeUpdateStudent] = useState(false);
    let [gradeUpdateAssignment, setGradeUpdateAssignment] = useState(false);
    // let [stateNewStudents, setNewStudents] = useState([]);
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    let stateNewStudents;
    const [modalStudents, setModalStudents] = useState([]);
    const [modalSelected, setModalSelected] = useState();
    let studentCounter = 0;
    const [stateEnrolledStudents, setEnrolledStudents] = useState([]);
    let enrolledStudents = [];
    let [usersForSplice, setUsersSplice] = useState([]);
    let loadedGrade = false;




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
        loadedGrades = false;

    };

    const handleLogUserData = () => {
        compileGrades();
        getStudentForRow();
        compileStudents();
        loadedGrade = true;
    };


    const handleUpdateGrade = (student, assignment) => {


        setShowGradeModal(true);
        setGradeUpdateStudent(student);
        setGradeUpdateAssignment(assignment);
    };

    const updateGrade = (student, assignment) => {

        gradeUpdateStudent = student;
        gradeUpdateAssignment = assignment;


        handleUpdateGrade(student, assignment);


    }

    const enrolledStudentsFunction = () =>{


    }
    const saveNewGrade= async (newGrade) => {


        const fetchData = async () => {

            await Promise.all([
                fetchUserById(1),
                fetchUsers(),
                fetchClassByUserId(),
                fetchAssignments(),
                fetchUsersForStudents()
            ]);

            await Promise.all([
                fetchAssignments(),
                fetchStudents(),
                fetchGrades()
            ]);

        };

        let previousGrade = false;
        let gradeToChange;
        for(let i = 0; i < rawGrades.length; i++){
            if((rawGrades[i].studentId == gradeUpdateStudent.userId) && (rawGrades[i].assignmentId == gradeUpdateAssignment.assignmentId)){
                previousGrade = true;
                gradeToChange = rawGrades[i];
            }
        }


        if(previousGrade){
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/grade/${gradeToChange.gradeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ grade: newGrade }),
            });
            if (!response.ok) {
                throw new Error('Failed to update assignment name');
            }

            await fetchData();
        }else{

            const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/grade/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId: gradeUpdateStudent.studentUserId,
                    grade: newGrade,
                    assignmentId: gradeUpdateAssignment.assignmentId
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create class');
            }

            await fetchData();
        }

    }
    const handleSubmitGrade = (newGrade, student, assignment) => {

        saveNewGrade(newGrade);
        setShowGradeModal(false);
    };

    const compileGrades = () => {

        // if(loadedGrades == false) {

            let classAssignments = [];
            let classStudents = [];
            let currClassGrade = [];
            for (let i = 0; i < assignments.length; i++) {
                    if (assignments[i].classId == selectedClass.classId) {
                        classAssignments.push(assignments[i]);

                    }


            }
            for (let i = 0; i < students.length; i++) {
                if (students[i].classId == selectedClass.classId) {
                    classStudents.push(students[i]);
                }
            }

            for (let x = 0; x < classStudents.length; x++) {
                for (let i = 0; i < classAssignments.length; i++) {
                    let foundNumber = false
                    for (let z = 0; z < rawGrades.length; z++) {
                        if ((rawGrades[z].assignmentId == classAssignments[i].assignmentId) && (rawGrades[z].studentId == classStudents[x].userId)) {
                            currClassGrade.push(rawGrades[z].grade);
                            classGrades.push(rawGrades[z].grade);
                            foundNumber = true;
                        }
                    }
                    if(foundNumber == false){
                        classGrades.push('');
                    }
                }
            }

            setClassGrades(classGrades);

            loadedGrades = true;



    }


    const compileStudents = () => {


        stateNewStudents = usersForSplice;

        for(let i = 0; i < stateNewStudents.length; i++){
            if(stateNewStudents[i].role.id == 1){
                stateNewStudents.splice(i, 1);
            }
        }


        for(let i = 0; i < stateNewStudents.length; i++){
            for(let x = 0; x < students.length; x++){
                if((students[x].userId == stateNewStudents[i].id) && (students[x].classId == selectedClass.classId)){
                    stateNewStudents.splice(i, 1);
                }
            }
        }


        setModalStudents(stateNewStudents);
        setModalSelected(selectedClass);
    }



    const handleAddStudent = () => {
        setShowAddStudentModal(true);
    };

    const handleCloseAddStudentModal = () => {

        setShowAddStudentModal(false);
        compileGrades();
        getStudentForRow();
        compileStudents();
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudentId(studentId);

    };


    const handleCreateClass = async () => {

        try {
            const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/class', {
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
            const response = await fetch('https://datagradebackend-f2ecd09dee7f.herokuapp.com/assignment', {
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



    };





    const incrementTdCounter = () => {
        counter = counter + 1;
    }

    const incrementStudentCounter = () => {
        studentCounter = studentCounter + 1;
    }
    const fetchUserById = async (userId) => {
        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/users/${userId}`);
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
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const usersData = await response.json();
            setUsers(usersData);

        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchUsersForStudents = async () => {
        let newUser;
        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const usersData2 = await response.json();
            setUsersSplice(usersData2);
        } catch (error) {
            console.error('Error fetching user:', error);
        }

    };
    const fetchClassByUserId = async () => {
        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/class`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const classData = await response.json();
            setClass(classData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchAssignments = async () => {

        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/assignment`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const assignmentData = await response.json();
            setAssignments(assignmentData);

        } catch (error) {
            console.error('Error fetching user:', error);
        }

    };

    const fetchStudents = async () => {

        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/student`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const studentData = await response.json();
            setStudents(studentData);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    const fetchGrades = async () => {
        try {
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/grade`);
            if (!response.ok) {
                throw new Error('Failed to fetch grades');
            }
            const gradeData = await response.json();
            setRawGrades(gradeData);
            const updatedGrades = {};
            gradeData.forEach(grade => {
                const { studentId, assignmentId, grade: studentGrade } = grade;
                if (!updatedGrades[studentId]) {
                    updatedGrades[studentId] = {};
                }
                updatedGrades[studentId][assignmentId] = studentGrade;
            });

        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };



    const getStudentForRow = () => {
        let enrolledStudentsInSelected = [];
        for(let i = 0; i < students.length; i++){
            if(students[i].classId == selectedClass.classId){
                enrolledStudentsInSelected.push(students[i])
            }
        }
        let returnValue = enrolledStudentsInSelected;
        setEnrolledStudents(enrolledStudentsInSelected);
        return returnValue;
    }

    const handleAssignmentNameChange = async (index, newName) => {
        try {
            const assId = assignments[index].assignmentId;
            const response = await fetch(`https://datagradebackend-f2ecd09dee7f.herokuapp.com/assignment/${assId}`, {
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

        loadingCounter.current += 1;

        loadingCounter.current -= 1;
        checkLoadingStatus();

    }, [user, classes]);

    useEffect(() => {

        loadingCounter.current += 1;
        const fetchData = async () => {
            await Promise.all([
                fetchUserById(1),
                fetchUsers(),
                fetchClassByUserId(),
                fetchAssignments(),
                fetchUsersForStudents()
            ]);

            await Promise.all([
                fetchAssignments(),
                fetchStudents(),
                fetchGrades()
            ]);



            loadingCounter.current -= 1;
            checkLoadingStatus();
        };

        fetchData();



        if (showGraph && chartRef && chartRef.current) {
            const prepareChartData = () => {
                const labels = ["A", "B", "C", "D", "F"];
                const data = [0, 0, 0, 0, 0];

                Object.values(rawGrades).forEach(grade => {
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
                const ctx = chartRef.current.getContext("2d");
                const { labels, data } = prepareChartData();
                new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: ["As", "Bs", "Cs", "Ds", "Fs"],
                        datasets: [{
                            label: "Average Grade",
                            data: data,
                            backgroundColor: "#a6761d",
                            borderColor: "rgba(54, 162, 235, 1)",
                            borderWidth: 1,
                            barPercentage: 0.8,
                            categoryPercentage: 0.9,
                            color: "red"
                        }]
                    },
                    options: {
                        indexAxis: "y",
                        scales: {
                            x: {
                                beginAtZero: true,
                                fontColor: "red",
                                title: {
                                    display: true,
                                    text: "Grades"
                                }
                            },
                            y: {
                                fontColor: "red",
                                title: {
                                    display: true,
                                    text: "Students",
                                    font: {
                                        size: 60,
                                        weight: 'bold',
                                        fontColor: 'red'

                                    }
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true
                            },
                            title: {
                                display: true,
                                text: "Grade Average",
                                font: {
                                    size: 60,
                                    weight: 'bold',
                                    fontColor: 'red'
                                }
                            }
                        },
                        layout: {
                            // padding: {
                            //     left: 20,
                            //     right: 20,
                            //     top: 20,
                            //     bottom: 20
                            // }
                        },
                        // responsive: true,
                        // maintainAspectRatio: false
                    }
                });
            }
        }

    }, [showGraph]);

    useEffect(() => {
        loadingCounter.current += 1;
        if (showPieChart && pieChartRef && pieChartRef.current) {
            const preparePieChartData = () => {
                const data = [0, 0, 0, 0, 0];

                Object.values(rawGrades).forEach(grade => {
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
        loadingCounter.current -= 1;
        checkLoadingStatus();
    }, [showPieChart, rawGrades]);

    const checkLoadingStatus = () => {
        if (loadingCounter.current === 0) {
            setIsLoading(false); // Set isLoading to false when all effects are completed
        }
    };

    useEffect(() => {
        if (!isLoading) {
            doneLoadingFunction();
        }
    }, [isLoading]);

    useEffect(() => {
        if (!assignments || !students || !rawGrades || !selectedClass) return;

    }, [assignments, students, rawGrades, selectedClass]);




    const doneLoadingFunction = () => {
    };


    return (
        <div className="gradebook-gradebook">
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
            <main className="gradebook-main">
                <div className="controls">


                    {selectedClass !== undefined && (

                        <div className="controls">
                            <button onClick={handleShowGraph} className="add-button">Show Graph</button>
                            <button className="add-button" onClick={handleShowPieChart}>Show Pie Chart</button>
                            <button onClick={handleAddStudent} className="add-button">Add Student</button>
                            <button onClick={handleAddAssignment} className="add-button">Add Assignment</button>
                            <button onClick={handleLogUserData} className="add-button">Load Grades</button>
                        </div>
                    )}

                </div>

                <div className="grades">
                    <h2>Grades for {selectedClass ? selectedClass.subject : ''}</h2>
                    <table>
                        <thead>

                        <tr>
                            <th>Student</th>
                            {selectedClass && assignments
                                .filter(assignment => assignment.classId === selectedClass.classId)
                                .map((assignmentItem, index) => {
                                    setTimeout(() => {
                                        // compileGrades();
                                    }, 1000);
                                    return (
                                        <th key={index}>
                                            <input
                                                type="text"
                                                value={assignmentItem.name}
                                                onChange={(event) => handleAssignmentNameChange(index, event.target.value)}
                                            />
                                        </th>
                                    )
                                })}
                        </tr>
                        </thead>
                        <tbody>
                        {selectedClass && students
                            .filter(student => student.classId === selectedClass.classId)
                            .map((studentItem, studentIndex) => {

                                incrementStudentCounter()
                                return (
                                    <tr key={studentIndex}>
                                        <td>{users[studentItem.userId - 1].name}</td>
                                        {selectedClass &&
                                            assignments
                                                .filter(assignment => assignment.classId === selectedClass.classId)
                                                .map((assignment, assignmentIndex) => {
                                                    const gradeIndex = studentIndex * assignments.length + assignmentIndex;
                                                    incrementTdCounter();
                                                    setTimeout(() => {
                                                    }, 1000);
                                                    return (
                                                        <td key={assignmentIndex}>
                                                            {stateClassGrades[(counter - 1)]}
                                                            <button onClick={() => updateGrade(studentItem, assignment)} className="update-button">update</button>
                                                        </td>
                                                    );

                                                })}
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>

                    {showGradeModal && (
                        <Modal onClose={() => setShowGradeModal(false)}>
                            <GradeModal onClose={() => setShowGradeModal(false)} onSubmit={handleSubmitGrade}student={gradeUpdateStudent}assignment={gradeUpdateAssignment} />
                        </Modal>
                    )}
                    {showAddStudentModal && (
                        <Modal onClose={handleCloseAddStudentModal}>
                            <StudentModal selectedClass={selectedClass} students={modalStudents} onClose={handleCloseAddStudentModal} onSelectStudent={handleSelectStudent} onSubmit={handleAddStudent} />
                        </Modal>
                    )}
                    {showGraph && (

                        <Modal  onClose={handleCloseModal}>
                            <h2>Grade Average</h2>
                            <canvas ref={chartRef} className="small-graph"></canvas>
                        </Modal>
                    )}
                    {showPieChart && (
                        <div>
                        <Modal onClose={() => setShowPieChart(false)}>
                            <h2>Grade Average</h2>
                            <canvas ref={pieChartRef} className="small-graph"></canvas>
                        </Modal>
                        </div>
                    )}

                </div>

                <div>
                    {/*{showGraph && (*/}
                    {/*    <Modal style={{ width: '80%', height: '80%' }} onClose={handleCloseModal}>*/}
                    {/*        <canvas ref={chartRef}></canvas>*/}
                    {/*    </Modal>*/}
                    {/*)}*/}
                </div>
            </main>
        </div>
    );
};

export default GradeBook;
