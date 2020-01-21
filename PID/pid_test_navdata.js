var arDrone = require('ar-drone');
var droneClient = arDrone.createClient();
droneClient.config('general:navdata_demo', 'FALSE'); // get back all data the copter can send
droneClient.config('general:navdata_options', 777060865); // turn on GPS
var counter = 0;
var flightEnded = false;
//Initialize pid gain constants -- subject to tuning
var kp = 0.3;
var ki = 0.25;
var kd = 0.4;

var err_p_long = 0, err_p_lat = 0, err_p_elev = 0;
var err_i_long = 0, err_i_lat = 0, err_i_elev = 0;
var err_d_long = 0, err_d_lat = 0, err_d_elev = 0;

var curLat1 = 0, curLat2 = 0;
var curLong1 = 0, curLong2 = 0;
var curElev1 = 0, curElev2 = 0;

var pseudoLeaderElevation = 26;
droneClient.takeoff();

//Function for processing navdata data -- loops infinitely until process.exit()
droneClient.on('navdata', function(navdata) {
	try{
		// console.log('latitude: ' + navdata.gps.latitude + ', longitude: '
		// 	+ navdata.gps.longitude + ' elevation: ' + navdata.gps.elevation);
		console.log('latitude: ' + navdata.gps.latitude + ', longitude: '
			+ navdata.gps.longitude + ' elevation: ' + navdata.gps.elevation);
		counter += 1;
		console.log("Counter is: " + counter);
		droneClient.up(1);	//Increases drone elevation
		// if(navdata.gps.latitude > 46){
		// 	droneClient.land();
		// 	console.log("Stop at" + navdata.gps.latitude);
		// 	process.exit();
		// }
		// if(navdata.gps.longitude > 46){
		// 	droneClient.land();
		// 	console.log("Stop at" + navdata.gps.latitude);
		// 	process.exit();
		// }
		if(navdata.gps.elevation > pseudoLeaderElevation){
			droneClient.land();
			console.log("Stop at" + navdata.gps.elevation);	//For testing
		}
		if(counter == 1000){	//set coordinates close to leader drone
			droneClient.land();	//this doesn't make it land for some reason - process.exit probably executes faster than droneClient.land
			process.exit();	//my fking god it exits finally
		}

	}catch(err){
		console.log(err.message);
		return;
	}
});

//Can test for elevation
// curElev1 = navdata.gps.elevation;
// err_p_elev = pseudoLeaderElevation - curElev1;
//
// err_i_elev = curElev1 - leaderElev + err_i_elev;

// if(counter == 1){
// 	curElev2 = navdata.gps.elevation;
// }else{
// 	curElev1 = curElev2;
// 	curElev2 = navdata.gps.elevation;
// }
// err_d_elev = curElev2 - curElev1;
//
// correction_elev = err_p_elev * kp + err_i_elev * ki + err_d_elev * kd;
//
// if(correction_elev < 0){	//Negative elevation
// 		droneClient.down(correction_elev * -1);
// }else{
// 	droneClient.up(correction_elev);
// }

//
	/*
		//for Proportional
		err_p_lat = leaderLat - followerLat ;
		err_p_long = leaderLong - followerLong;
		err_p_elev = leaderElev - followerElev;

		//for Integral - do intervals of 30counters? (appx 2s)
		if(counter % 30 ==0){
			err_i_lat = leaderLat - currLat + err_i_lat;
			err_i_long = leaderLong - currLong + err_i_long;
			err_i_elev = leaderElev - currElev + err_i_elev;
		}
		//for Derivative
		Similarly for d, curLat1 - curLat2, constantly update.
		if(counter == 1){
			curLat2 = navdata.gps.latitude;
			curLong2 = navdata.gps.longitude;
			curElev2 = navdata.gps.elevation;
		}else{
			curLat1 = curLat2;
			curLong1 = curLong2;
			curElev1 = curElev2;
			curLat2 = navdata.gps.latitude;
			curLong2 = navdata.gps.longitude;
			curElev2 = navdata.gps.elevation;
		}
		err_d_lat = curLat2 - curLat1;
		err_d_long = curLong2 - curLong1;
		err_d_elev = curElev2 - curElev1;

		Error correction equation might need scaling
		correction_lat = err_p_lat * kp + err_i_lat * ki + err_d_lat * kd;
		correction_long = err_p_long * kp + err_i_long * ki + err_d_long * kd;
		correction_elev = err_p_elev * kp + err_i_elev * ki + err_d_elev * kd;

		Calculations done then control the motors
		if(correction_elev < 0){	//Negative elevation
				client.down(correction_elev * -1);
		}else{
			client.up(correction_elev);
		}

		calculate speed for each based on error
		maybe just use error as the speed

		droneClient.front(speed) <- use pid to adjust front speed if we can somehow get speed... use constant for now
		droneClient.clockwise(speed) <- use pid to adjust also
		droneClient.up(speed) 	<- use pid to adjust DEPENDING ON ERROR choose either up or down
		droneClient.down(speed) <- use pid to adjust DEPENDING ON ERROR
		//Potential Examples --
	*/
