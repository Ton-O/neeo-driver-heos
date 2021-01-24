'use strict';

const config = require('./config');
const Discover = require('./discover');

var connected = false;

// HEOS API Documentation http://rn.dmglobal.com/euheos/HEOS_CLI_ProtocolSpecification.pdf */

var heosDevices = [];				// Array with connected heos Devices.
var heosPlayers = [];				// Array with discovered Heos Players.
let sendComponentUpdate;		// Function to inform about state changes.
var masterDevice = null;		// First discovered HEOS Device will be the Master



//Export of all heosCommands so the index.js can add all buttons.
module.exports.heosCommands = function() {
	return heosCommands();
}

function heosCommands() {
    return    [
	//paste the keymap table here
{neeo: 'VOLUME UP', heos:'heos://player/volume_up?pid=player_id&step=3\n'},
{neeo: 'VOLUME DOWN', heos:'heos://player/volume_down?pid=player_id&step=3\n'},
{neeo: 'MUTE TOGGLE', heos:'heos://player/toggle_mute?pid=player_id\n'},
{neeo: 'PLAY', heos:'heos://player/set_play_state?pid=player_id&state=play\n'},
{neeo: 'PAUSE', heos:'heos://player/set_play_state?pid=player_id&state=pause\n'},
{neeo: 'STOP', heos:'heos://player/set_play_state?pid=player_id&state=stop\n'},
{neeo: 'SKIP BACKWARD', heos:'heos://player/play_previous?pid=player_id\n'},
{neeo: 'SKIP FORWARD', heos:'heos://player/play_next?pid=player_id\n'},

{neeo: 'VOLUME LIGHT', heos:'heos://player/set_volume?pid=player_id&level=40\n'},
{neeo: 'VOLUME MEDIUM', heos:'heos://player/set_volume?pid=player_id&level=30\n'},
{neeo: 'VOLUME HEAVY', heos:'heos://player/set_volume?pid=player_id&level=20\n'},


//Not mapped heosCommands
{neeo: 'POWER ON', heos:'dummy1\n'},
{neeo: 'POWER OFF', heos:'dummy2\n'},
{neeo: 'GET PLAYERS', heos:'heos://player/get_players\n'},
{neeo: 'GET GROUPS', heos:'heos://group/get_groups\n'},
{neeo: 'REGISTER CHANGE EVENTS', heos:'heos://system/register_for_change_events?enable=on\n'},
{neeo: 'GET PLAYER PLAYING MEDIA', heos:'heos://player/get_now_playing_media?pid=player_id\n'},

{neeo: 'INFO GROUP', heos:'//group/get_group_info?gid=group_id\n'},
{neeo: 'INFO SOURCE', heos:'//browse/get_source_info?sid=source_id\n'},
{neeo: 'INFO PLAYER', heos:'//player/get_player_info?pid=player_id\n'},

{neeo: 'INPUT AUX1', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/aux1\n'},
{neeo: 'INPUT AUX2', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/aux2\n'},
{neeo: 'INPUT BLURAY', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/bluray\n'},
{neeo: 'INPUT CABLE/SAT', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/inputs/cable_sat\n'},
{neeo: 'INPUT CD', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/cd\n'},
{neeo: 'INPUT DVD', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/dvd\n'},
{neeo: 'INPUT GAME', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/game\n'},
{neeo: 'INPUT IPOD/USB', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/usbac\n'},
{neeo: 'INPUT PHONO', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/phonoa\n'},
{neeo: 'INPUT TV AUDIO', heos:'//browse/play_input?pid=destination_player_id&spid=source_player_id&input=inputs/tvaudio\n'},

];
}

module.exports.heosDeviceButtonPressed = function heosDevicesButtonPressed(name, deviceid) {
		sendPlayerCommand(name,deviceid);
}

module.exports.getNowPlaying = function(deviceid) {
	var nowPlaying = "'"+heosPlayers.find(o => o.pid === parseInt(deviceid)).song;
	nowPlaying = nowPlaying+"' by '"+heosPlayers.find(o => o.pid === parseInt(deviceid)).artist;
	nowPlaying = nowPlaying+"' from the Album '"+heosPlayers.find(o => o.pid === parseInt(deviceid)).album+"'";
	return nowPlaying;
}

module.exports.getImageUri = function(deviceid) {
	 return heosPlayers.find(o => o.pid === parseInt(deviceid)).image_url;
}

function sendCommand(command){
		if(connected){
		 console.log("send Command: "+command);
		 masterDevice.write(command+" \n");
	 }
	 else{
		 console.log("No Connetion to HEOS Master");
	 }
}

function sendHeosCommand(command){
		 sendCommand(mapCommand(command));
}

function sendPlayerCommand(command,playerID){
  var heoscommand = mapCommand(command).replace('player_id',playerID);
	masterDevice.write(heoscommand+" \n");
}

function sendGroupCommand(command,groupID){
	var heoscommand = mapCommand(command).replace('group_id',groupID);
	masterDevice.write(heoscommand+" \n");
}

function mapCommand(command){
		console.log("Command received: "+command)
		const keyMap = heosCommands().find((key) => key.neeo === command);
		return keyMap.heos;
}

function hasPlayers(){
	if (heosPlayers.length>0) return true;
	else return false;
}


module.exports.registerStateUpdateCallback = function(updateFunction) {
  console.log('[CONTROLLER] register update state');
  sendComponentUpdate = updateFunction;
};

function heos_connect(ip) {
	if(!connected){
		var net = require('net');
		console.log('connecting to heos master'+ip)
		heosDevices[ip] = new net.Socket();
		heosDevices[ip].connect(config.heos.port, ip);
		masterDevice = heosDevices[ip];
		connected=true;
		sendHeosCommand('REGISTER CHANGE EVENTS');
    sendHeosCommand('GET PLAYERS');

		//On error....
		masterDevice.on('error', function(err){
		    console.log("Error: "+err.message);
				masterDevice = null;
				connected = false;
		});

	    //When we receive data, used for informing NEEO.
		heosDevices[ip].on('data', function(data) {
			if (typeof data !== 'undefined') {
					var results = (data+"").split("\n");
					results.splice(-1,1)
					for (var i in results){
						var result = {};
						try {
							result = JSON.parse(results[i]);

						} catch (e) {
							return console.error(e);
						}

						switch (result['heos'].command) {
							case "player/get_players":
									setPlayers(result['payload']);
									break;
							case "player/get_now_playing_media":
									setPlayerMedia(result['heos'].message.replace("pid=",""),result['payload']);
									break;
							case "event/player_now_playing_changed":
									sendPlayerCommand('GET PLAYER PLAYING MEDIA',result['heos'].message.replace("pid=",""));
									break;
							case "event/player_now_playing_progress":
									break;
							case "player/volume_up":
									break;
							case "player/volume_down":
									break;
							default:
								console.log("Unhandled Response: "+data);
						}

					}



			}
		});
		heosDevices[ip].on('close', function() {
				console.error("Connection closed. ");
				connected = false;
				masterDevice = null;
		});
	}

}


function setPlayers(data){
	for (var player in data) {
			(data[player]).artist="";
			(data[player]).song="";
			(data[player]).album="";
			(data[player]).image_url="";
			heosPlayers.push(data[player]);
	  }
}

function setPlayerMedia(playerID,data){
			var player = heosPlayers.find(o => o.pid === parseInt(playerID))
			player.artist=data.artist;
			player.song=data.song;
			player.album=data.album;
			player.image_url=data.image_url;
			sendComponentUpdate({ uniqueDeviceId: playerID, component:'nowPlaying', value: "'"+data.song+"' by '"+data.artist+"' from the Album '"+data.album+"'" });
			sendComponentUpdate({ uniqueDeviceId: playerID, component:'albumcover', value: data.image_url });
}

function heosPlayerDiscovery() {
	return heosPlayers;
}

module.exports.discoverHeosPlayers = function() {
  console.log('[CONTROLLER] Heos discovery call');
  return heosPlayerDiscovery()
    .map((heosPlayers) => ({
      id: heosPlayers.pid,
      name: heosPlayers.name,
      reachable: true,
    }));
};

let discover = new Discover();
	console.log("Discover");
	discover.on('device', ( device ) => {
		heosDevices.push(device);
		heos_connect(device.address);
		console.log('Discovered Device: ', device);
	})

discover.start();
