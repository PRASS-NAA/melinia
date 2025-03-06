import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Complaintcard from './complaintCard';
import './homePage.css';

function Homepage() {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newComplaint, setNewComplaint] = useState({
        title: '',
        description: '',
        location: '',
        status: 'Pending',
        lawyerUsername: '',
        documents: []
    });
    const [documentFiles, setDocumentFiles] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get('http://localhost:5000/complaints');
                setComplaints(response.data);
                console.log(complaints);
            } catch (err) {
                alert('Error fetching complaints!');
            }
        };
        fetchComplaints();
    }, []);

    const handleFileChange = (e) => {
        setDocumentFiles(e.target.files);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newComplaint.title);
        formData.append('description', newComplaint.description);
        formData.append('location', newComplaint.location);
        formData.append('status', newComplaint.status);
        formData.append('lawyerUsername', newComplaint.lawyerUsername);

        Array.from(documentFiles).forEach((file) => {
            formData.append('documents', file);
        });

        try {
            const response = await axios.post('http://localhost:5000/complaint', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.status === 200) {
                alert('Complaint successfully filed');
                setShowForm(false);
                setNewComplaint({
                    title: '',
                    description: '',
                    location: '',
                    status: 'Pending',
                    lawyerUsername: '',
                    documents: []
                });
                setDocumentFiles([]);

                // Fetch updated complaints
                const updatedComplaints = await axios.get('http://localhost:5000/complaints');
                setComplaints(updatedComplaints.data);
                console.log(complaints);
            }
        } catch (err) {
            alert('Error filing complaint! Please try again later.');
        }
    };

    return (
        <>
            <h2>New Complaint</h2>
            <button onClick={() => setShowForm(!showForm)} className='add-btn'>
                {showForm ? 'Close Form' : '+'}
            </button>
            {showForm && (
                <form onSubmit={handleFormSubmit} className='complaint-form' encType='multipart/form-data'>
                    <input type='text' placeholder='Title' value={newComplaint.title}
                        onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })} required />
                    <input type='text' placeholder='Description' value={newComplaint.description}
                        onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} required />
                    <input type='text' placeholder='Location' value={newComplaint.location}
                        onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })} required />
                    <input type='text' placeholder='Lawyer Username' value={newComplaint.lawyerUsername}
                        onChange={(e) => setNewComplaint({ ...newComplaint, lawyerUsername: e.target.value })} required />
                    <input type='file' multiple onChange={handleFileChange} />
                    <button type='submit'>Submit Complaint</button>
                </form>
            )}

            <div className='complaints-container'>
                <h2>Complaints</h2>
                <div className='complaints-list'>
                    {complaints.map((complaint, index) => (
                        <Complaintcard
                            key={index}
                            title={complaint.title}
                            description={complaint.description}
                            location={complaint.location}
                            documents={complaint.documents}
                            status={complaint.status}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Homepage;
