const pool = require('../config/db');

// Add a new school
const addSchool = async (req, res) => {
    try {
        const { name, address, latitude, longitude } = req.body;

        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [name, address, latitude, longitude]);

        res.status(201).json({
            message: 'School added successfully',
            schoolId: result.insertId
        });
    } catch (error) {
        console.error('Error in addSchool:', error);
        res.status(500).json({ error: 'Internal server error while adding school' });
    }
};

// List all schools, sorted by proximity
const listSchools = async (req, res) => {
    try {
        // Parse user latitude and longitude from query params
        const userLat = parseFloat(req.query.latitude);
        const userLng = parseFloat(req.query.longitude);

        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ error: 'Valid latitude and longitude are required as query parameters.' });
        }

        // MySQL query using the Haversine formula to compute distance in kilometers
        const query = `
            SELECT id, name, address, latitude, longitude,
                (
                    6371 * acos(
                        cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) +
                        sin(radians(?)) * sin(radians(latitude))
                    )
                ) AS distance
            FROM schools
            ORDER BY distance ASC
        `;
        
        // Pass parameters: userLat, userLng, userLat
        const [rows] = await pool.execute(query, [userLat, userLng, userLat]);

        res.status(200).json({
            message: 'Schools retrieved successfully',
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error in listSchools:', error);
        res.status(500).json({ error: 'Internal server error while retrieving schools' });
    }
};

module.exports = {
    addSchool,
    listSchools
};
