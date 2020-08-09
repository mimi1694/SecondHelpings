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
  },
  "memes-diner": {
    "name": "Meme's Diner",
    "address": {
      "Pc": 40.6777,
      "Vc": 73.9635,
      "latitude": 40.6777,
      "longitude": 73.9635
    },
    "dishes": ["/dishes/memes-pancakes", "/dishes/memes-french-toast"],
    "start": "9:00",
    "end": "14:00",
    "id": "memes-diner",
    "mon": true,
    "tues": true,
    "wed": true,
    "thurs": true,
    "fri": true,
    "ordersPerSlot": 6,
    "slotsIncrement": 20
  }
}