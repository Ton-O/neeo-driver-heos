//-------------------------------------------
// Config initialization
//-------------------------------------------
let config = {};
config.heos = {};
config.neeo = {};

//-------------------------------------------
// heos Settings
//-------------------------------------------

// Set the IP address of your heos MediaCenter
config.heos.ip = '192.168.0.x';

// Set the Port of the heos API (Default is 1155)
config.heos.port = 1255;

// ------------------------------------------
// NEEO Settings
// ------------------------------------------

// Set the IP address of the NEEO Brain, or leave empty to auto discover
// Note: Auto discover the NEEO brain did not work always for me
config.neeo.brainIp = '192.168.0.x';

// Set the local TCP port for the NEEO REST-WebService
config.neeo.port = 6336;

// The next parameters the driver name and manufacturer.
// You only need to change this if you want to run multiple instances of the driver to control multiple heos instances.
config.neeo.adapterName = 'custom-adapter';
config.neeo.driverName = 'HEOS';
config.neeo.driverManufacturer = 'heos';

//-------------------------------------------
module.exports = config;
