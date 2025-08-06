# AirportTracker
Full stack web application to track and rate airport experiences with Node.JS, Express, and vanilla JavaScript

Features

Dashboard 
- Statistics overview: total airports visited, average rating, top-rated airport
- Cards: gradient stat cards with visit metrics

Airport Grid
- Card layout: each airport is displayed on a card
- Information: airpot code, name, city, country, visit date
- Star ratings: visual 1-5 star rating
- Personal notes: comments/experiences from each trip
- Delete: ability to remove cards

Add New Visits 
- Form: all essential information concentrated in one form
- Interactive ratings: click on the star to assign a rating
- Auto-formating: automatically capitalizes airport codes

Design
- Custon color pallet from Cool0rs.co
- Blur effects and transparency
- Hover effects, transitions, and micro-interactions

Colors (thanks to Coolors.co)
- Deep Blue: #2D728F
- Light Blue: #3B8EA5
- Cream: #F5EE9E
- Orange: #F49E4C
- Dark Red: #AB3428

Requires Node.js and npm

To Use:

1. Clone the repository
```text
   git clone https://github.com/mjc180501/AirportTracker.git
   cd AirportTracker
```

3. Install dependencies
 ```text
   npm install
  ```
5. Start the server
```text
   npm start
  ```
6. Navigate to https://localhost:3000

Project Structure:

```text
AirportTracker/
├── server.js         # Express.js backend API
├── package.json      # Dependencies and scripts
├── public/
│   └── index.html    # Frontend
├── airports.json     # Data storage (created automatically)
└── README.md         # Project documentation

```

API Endpoints

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/api/airports`       | Get all airport visits    |
| GET    | `/api/airports/:id`   | Get specific visit        |
| GET    | `/api/stats`          | Get statistics summary    |
| POST   | `/api/airports`       | Add new airport visit     |
| PUT    | `/api/airports/:id`   | Update airport visit      |
| DELETE | `/api/airports/:id`   | Delete airport visit      |

---

Each airport visit is represented as a JSON object:

```json
{
  "id": 1,
  "code": "STL",
  "name": "Lambert International Airport",
  "city": "St. Louis",
  "country": "United States",
  "visitDate": "yyyy-mm-dd",
  "rating": 4,
  "comments": "My home airport!",
  "createdAt": "2024-08-06T21:00:00.000Z",
  "updatedAt": "2024-08-06T21:00:00.000Z"
}
```


Built with: 
Node.js
Express.js
CORS
File System (fs)
JavaScript
HTML5
CSS3
Fetch API


Future Enhancements:
- Multi user support
- Airport Search
- Photos
- Advanced analytics and charts
- Social features

Contributions are welcome! Feel free to submit a pull request :)

