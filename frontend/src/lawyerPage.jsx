import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Complaintcard from './complaintCard';
import './lawyercomp.css';

function Lawyerpage() {
    const username = useParams().username;
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/complaints/${username}`);
                setComplaints(response.data);
            } catch (err) {
                alert("Error fetching complaints!");
            }
        };
        fetchComplaints();
    }, [username]);

    return (
        <>
            <h2>Hello {username}</h2>
            <div className='complaints-container'>
                <h2>Complaints</h2>
                <div className='complaints-list'>
                    {complaints.map((complaint, index) => (
                        <Complaintcard
                            key={index}
                            title={complaint.title}
                            description={complaint.description}
                            location={complaint.location}
                            documents={complaint.documents.map((doc, i) => (
                                <a key={i} href={`http://localhost:5000/${doc}`} target="_blank" rel="noopener noreferrer">
                                    Document {i + 1}
                                </a>
                            ))}
                            status={complaint.status}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

export default Lawyerpage;
