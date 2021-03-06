"use strict";

/**
 * Constructor for a person.
 * @param gender
 * @param gender_pref
 * @param time_start
 * @param time_end
 * @param start_lat
 * @param start_long
 * @param dest_lat
 * @param dest_long
 * @param avg_rating
 * @constructor
 */
function Person(gender, gender_pref, time_start, time_end, start_lat, start_long, dest_lat, dest_long, avg_rating) {
    this.gender = gender;
    this.gender_pref = gender_pref;
    this.time_start = new Date(time_start);
    this.time_end = new Date(time_end);
    this.start_lat = start_lat;
    this.start_long = start_long;
    this.dest_lat = dest_lat;
    this.dest_long = dest_long;
    this.avg_rating = avg_rating;
}

module.exports = Person;

/**
 * Computes a score for two people based on how well-matched they are.
 * @param {Person} person1
 * @param {Person} person2
 * @return {Number} score
 *      score is a number between 0 and 1, or NEGATIVE_INFINITY
 *          Number.NEGATIVE_INFINITY: means the two people are incompatible
 *          1: means the two people are a perfect match
 */
function score(person1, person2) {

    // GENDER MATCH
    var gender_match = ((person1.gender_pref === person2.gender || person1.genderpref === 0) &&
                        (person1.gender === person2.gender_pref || person2.genderpref === 0));

    if (!gender_match) return Number.NEGATIVE_INFINITY;

    // DEPARTURE OVERLAP
    var departure_overlap = ((person1.time_start <= person2.time_end && person2.time_start <= person1.time_end));

    if (!departure_overlap) return Number.NEGATIVE_INFINITY;

    // RATING MATCH
    // between 0 (bad) and 1 (good)
    var rating_score = (5 - Math.abs(person1.avg_rating - person2.avg_rating))/5;

    // TRIP OVERLAP
    // between 0 (bad) and 1 (good)
    var x_1 = getDistanceFromLatLonInKm(person1.start_lat,person1.start_long,person2.start_lat,person2.start_long)      // distance between person1 start and person2 start
    var x_2 = getDistanceFromLatLonInKm(person1.start_lat,person1.start_long,person1.dest_lat,person1.dest_long)        // distance between person1 start and person1 end
    var x_3 = getDistanceFromLatLonInKm(person2.start_lat,person2.start_long,person1.dest_lat,person1.dest_long)        // distance between person2 start and person1 end
    var x_4 = getDistanceFromLatLonInKm(person1.start_lat,person1.start_long,person2.dest_lat,person2.dest_long)        // distance between person1 start and person2 end
    var x_5 = getDistanceFromLatLonInKm(person2.start_lat,person2.start_long,person2.dest_lat,person2.dest_long)        // distance between person2 start and person2 end
    var x_6 = getDistanceFromLatLonInKm(person1.dest_lat,person1.dest_long,person2.dest_lat,person2.dest_long)          // distance between person1 end and person2 end

    // calculate the shortest trip where two people meet at one start location, leave each other at one dest location
    var dist_total = x_1 + x_6 + Math.min(x_2,x_4,x_3,x_5);
    console.log("dist_total: " + dist_total);

    // compute ratio of distance travelled for each person travelling independently to two people taking trip together
    var distance_match = (2*dist_total)/(x_2+x_5);
    console.log("distance_match: " + distance_match);

    // COMPUTE SCORE
    // between 0 (bad) and 1 (good)
    return rating_score * 0.2 + distance_match * 0.8;
}

module.exports = score;

// https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
