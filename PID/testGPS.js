var arDrone = require('ar-drone');
var droneClient = arDrone.createClient(ip='192.168.0.50');
droneClient.config('general:navdata_demo', 'FALSE'); // get back all data the copter can send
droneClient.config('general:navdata_options', 777060865); // turn on GPS
droneClient.config('control:altitude_max', 20000); //change the max altitude to 20 meters
droneClient.config('general:navdata_options',
                default_navdata_options |
                navdata_option_mask(arDroneConstants.options.MAGNETO));

droneClient.on('navdata', function(navdata) {
	try{
		console.log('latitude: ' + navdata.gps.latitude + ', longitude: ' 
			+ navdata.gps.longitude + ' elevation: ' + navdata.gps.elevation);
	}catch(err){
		console.log(err.message);
	};
	/*droneClient.after(1000, function() { //after 1 more seconds, stop spinning
		this.takeoff();
	})
	droneClient.after(1000, function() { //after 1 more seconds, land drone
		this.land();
	});*/
});

droneClient.after(1000,function() {
	this.takeoff();
})

//this is to calibrate the magnetometer of the drone
droneClient.calibrate(0)

droneClient.after(1000,function() {
	this.land();
})