import React from 'react';
import './lawyercomp.css';

function Complaintcard({ title, description, location, documents, status }) {
    return (
        <div className='complaint-card'>
            <h3>{title}</h3>
            <p><strong>Description:</strong> {description}</p>
            <p><strong>Location:</strong> {location}</p>
            <div className='documents'>
                <strong>Related Documents:</strong>
                <ul>
                    {documents.map((doc, i) => (
                        <li key={i}>
                            <a href={`http://localhost:5000${doc}`} target='_blank' rel='noopener noreferrer'>
    Document {i + 1}
</a>

                        </li>
                    ))}
                </ul>
            </div>
            <p><strong>Status:</strong> {status}</p>
        </div>
    );
}

export default Complaintcard;
