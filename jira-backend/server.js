// Importing modules
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { verifyToken } = require('./src/utils/utils');
const ROLE = require('./src/constants/ROLE');
const projectModel = require('./src/models/project.model');

// Importing routers
const routers = require('./src/routers/routers');
const fileModel = require('./src/models/file.model');

dotenv.config();
const app = express();
app.use(cors({
    origin: '*'
}));

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(database => {
        console.log(`Database ${database.connection.name} connected on ${database.connection.host}:${database.connection.port}`);
    })
    .catch(err => {
        console.error(err);
    })

// Enable parsing json data
app.use(express.json({
    limit: '10mb'
}));

// Enable serving static files
const assetsPath = path.join(__dirname, './uploads');
app.use('/assets', express.static(assetsPath));

// Multer configuration
const storage = multer.diskStorage({
    destination: (_req, file, res) => {
        if (file.mimetype.startsWith('image/')) {
            return res(null, path.join(__dirname, './uploads/images'));
        } else {
            return res(null, path.join(__dirname, './uploads/documents'));
        }
    },
    filename: (_req, file, res) => {
        const ext = path.extname(file.originalname);
        return res(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
});
// Upload Router
app.post('/upload', upload.single('file'), verifyToken, async (req, res) => {

    const auth = req.auth;
    if (auth.role == ROLE.UNAUTHORIZED) {
        return res.status(401).send({
            message: 'Unauthorized!'
        });
    }

    const {
        file_name,
        project_code
    } = req.body;

    const foundProject = await projectModel
        .findOne({ code: project_code });
    if(!foundProject) {
        return res.status(404).send({
            message: 'Project not found!'
        });
    }

    let file_type = 'documents';
    if(req.file.mimetype.startsWith('image/')) {
        file_type = 'images';
    }
    const server_file_path = `/assets/${file_type}/${req.file.filename}`;
    const newFile = new fileModel({
        author: auth.id,
        name: file_name,
        project: foundProject._id,
        link: server_file_path
    });
    await newFile.save();

    res.status(200).send({
        message: 'File(s) uploaded successfully',
        file: req.file
    });
});

app.use('/api', routers);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});