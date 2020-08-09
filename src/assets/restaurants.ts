export const Restaurants = {
  "prune": {
    "name": "Prune",
    "address": {
      "Pc": 40.778965,
      "Vc": -73.962311,
      "latitude": 40.778965,
      "longitude": -73.962311
    },
    "dishes": ["/dishes/prune-meatballs"],
    "start": "10:00",
    "end": "19:00",
    "id": "prune",
    "mon": true,
    "tues": true,
    "thurs": true,
    "fri": true,
    "slotsIncrement": 30,
    "ordersPerSlot": 2
  },
  "locanda-verde": {
    "name": "Locanda Verde",
    "address": {
      "Pc": 40.7199,
      "Vc": 74.01,
      "latitude": 40.7199,
      "longitude": 74.01
    },
    "dishes": ["dishes/locanda-chicken", "dishes/locanda-steak", "dishes/locanda-spaghetti"],
    "start": "14:00",
    "end": "17:00",
    "id": "locanda-verde",
    "mon": false,
    "tues": false,
    "wed": false,
    "thurs": true,
    "fri": true,
    "sat": true,
    "sun": false,
    "ordersPerSlot": 4,
    "slotsIncrement": 15
  }
}