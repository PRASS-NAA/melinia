import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/complaintsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB')).catch((err) => console.error('Connection error', err));

// File storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Models
const ComplaintSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    documents: [String],
    status: { type: String, default: 'Pending' }
});

const LawyerSchema = new mongoose.Schema({
    username: String,
    password: String,
    name: String,
    phoneNumber: String,
    assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }]
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);
const Lawyer = mongoose.model('Lawyer', LawyerSchema);

// Routes

// Fetch all complaints
app.get('/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        console.log(complaints);
        res.json(complaints);
    } catch (err) {
        res.status(500).send('Error fetching complaints');
    }
});

// Fetch complaints assigned to a specific lawyer
app.get('/complaints/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const lawyer = await Lawyer.findOne({ username: username.trim() }).populate('assignedComplaints');
        if (!lawyer) return res.status(404).send('Lawyer not found');
        res.json(lawyer.assignedComplaints);
    } catch (err) {
        res.status(500).send('Error fetching complaints for the lawyer');
    }
});

// Fetch all lawyers (for the search box)
app.get('/lawyers', async (req, res) => {
    try {
        const lawyers = await Lawyer.find({}, 'name username');
        res.json(lawyers);
    } catch (err) {
        res.status(500).send('Error fetching lawyers');
    }
});

// Create a new complaint and assign to a lawyer
app.post('/complaint', upload.array('documents'), async (req, res) => {
    const { title, description, location, status, lawyerUsername } = req.body;
    const documentFiles = req.files.map(file => `/uploads/${file.filename}`);

    try {
        const lawyer = await Lawyer.findOne({ username: lawyerUsername.trim() });
        if (!lawyer) return res.status(404).send('Lawyer not found');

        const complaint = new Complaint({ title, description, location, documents: documentFiles, status });
        await complaint.save();

        lawyer.assignedComplaints.push(complaint._id);
        await lawyer.save();

        res.status(200).send('Complaint registered successfully');
    } catch (err) {
        res.status(500).send('Error registering complaint');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const lawyer = await Lawyer.findOne({ username: username.trim() });
        if (!lawyer) {
            return res.status(404).send('Lawyer not found');
        }
        if (lawyer.password !== password) {
            return res.status(401).send('Incorrect password');
        }
        res.status(200).send('Login successful');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
