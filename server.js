// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'airports.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from public/ directory

// initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
        console.log('Found existing airports.json file');
    } catch (error) {
        // if file doesn't exist populate it with sample data
        console.log('Creating new airports.json file with sample data...');
        const sampleData = [
            {
                id: 1,
                code: 'JFK',
                name: 'John F. Kennedy International Airport',
                city: 'New York',
                country: 'United States',
                visitDate: '2023-06-15',
                rating: 4,
                comments: 'Great international terminal, but can be crowded. Good shopping and dining options.',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                code: 'LHR',
                name: 'London Heathrow Airport',
                city: 'London',
                country: 'United Kingdom',
                visitDate: '2023-07-22',
                rating: 5,
                comments: 'Excellent airport with efficient operations. Terminal 5 is particularly impressive.',
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                code: 'NRT',
                name: 'Narita International Airport',
                city: 'Tokyo',
                country: 'Japan',
                rating: 5,
                visitDate: '2023-09-10',
                comments: 'Incredibly clean and organized. Amazing attention to detail and service.',
                createdAt: new Date().toISOString()
            }
        ];
        await fs.writeFile(DATA_FILE, JSON.stringify(sampleData, null, 2));
        console.log('Created airports.json with sample data');
    }
}

// function to read airports data
async function readAirports() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading airports data:', error);
        return [];
    }
}

// function to write airports data
async function writeAirports(airports) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(airports, null, 2));
    } catch (error) {
        console.error('Error writing airports data:', error);
        throw error;
    }
}

// Routes

// GET /api/airports - Get all airports
app.get('/api/airports', async (req, res) => {
    try {
        const airports = await readAirports();
        res.json(airports);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch airports' });
    }
});

// GET /api/airports/:id - Get a specific airport
app.get('/api/airports/:id', async (req, res) => {
    try {
        const airports = await readAirports();
        const airport = airports.find(a => a.id === parseInt(req.params.id));
        
        if (!airport) {
            return res.status(404).json({ error: 'Airport not found' });
        }
        
        res.json(airport);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch airport' });
    }
});

// POST /api/airports - Add a new airport visit
app.post('/api/airports', async (req, res) => {
    try {
        const { code, name, city, country, visitDate, rating, comments } = req.body;
        
        // Validation
        if (!code || !name || !city || !country || !visitDate || !rating) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        const airports = await readAirports();
        
        // Check if airport code already exists
        if (airports.some(airport => airport.code.toUpperCase() === code.toUpperCase())) {
            return res.status(400).json({ error: 'Airport code already exists' });
        }
        
        // Create new airport visit
        const newAirport = {
            id: airports.length > 0 ? Math.max(...airports.map(a => a.id)) + 1 : 1,
            code: code.toUpperCase(),
            name,
            city,
            country,
            visitDate,
            rating: parseInt(rating),
            comments: comments || '',
            createdAt: new Date().toISOString()
        };
        
        airports.push(newAirport);
        await writeAirports(airports);
        
        res.status(201).json(newAirport);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add airport' });
    }
});

// PUT /api/airports/:id - Update an airport visit
app.put('/api/airports/:id', async (req, res) => {
    try {
        const airports = await readAirports();
        const airportIndex = airports.findIndex(a => a.id === parseInt(req.params.id));
        
        if (airportIndex === -1) {
            return res.status(404).json({ error: 'Airport not found' });
        }
        
        const { code, name, city, country, visitDate, rating, comments } = req.body;
        
        // Validation
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }
        
        // Check if new code conflicts with existing airports (excluding current one)
        if (code && code.toUpperCase() !== airports[airportIndex].code) {
            if (airports.some(airport => airport.code.toUpperCase() === code.toUpperCase())) {
                return res.status(400).json({ error: 'Airport code already exists' });
            }
        }
        
        // Update airport
        airports[airportIndex] = {
            ...airports[airportIndex],
            ...(code && { code: code.toUpperCase() }),
            ...(name && { name }),
            ...(city && { city }),
            ...(country && { country }),
            ...(visitDate && { visitDate }),
            ...(rating && { rating: parseInt(rating) }),
            ...(comments !== undefined && { comments }),
            updatedAt: new Date().toISOString()
        };
        
        await writeAirports(airports);
        
        res.json(airports[airportIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update airport' });
    }
});

// DELETE /api/airports/:id - Delete an airport visit
app.delete('/api/airports/:id', async (req, res) => {
    try {
        const airports = await readAirports();
        const airportIndex = airports.findIndex(a => a.id === parseInt(req.params.id));
        
        if (airportIndex === -1) {
            return res.status(404).json({ error: 'Airport not found' });
        }
        
        const deletedAirport = airports.splice(airportIndex, 1)[0];
        await writeAirports(airports);
        
        res.json({ message: 'Airport deleted successfully', airport: deletedAirport });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete airport' });
    }
});

// GET /api/stats - Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const airports = await readAirports();
        
        const stats = {
            totalAirports: airports.length,
            averageRating: airports.length > 0 ? 
                (airports.reduce((sum, airport) => sum + airport.rating, 0) / airports.length).toFixed(1) : 
                0,
            topRatedAirport: airports.length > 0 ? 
                airports.reduce((top, airport) => airport.rating > top.rating ? airport : top) : 
                null,
            countriesVisited: [...new Set(airports.map(a => a.country))].length,
            recentVisits: airports
                .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
                .slice(0, 5)
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
    try {
        await initializeDataFile();
        app.listen(PORT, () => {
            console.log(`🚀 Airport Tracker API running on port ${PORT}`);
            console.log(`🌐 Access the app at: http://localhost:${PORT}`);
            console.log('📁 Data will be stored in airports.json');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
