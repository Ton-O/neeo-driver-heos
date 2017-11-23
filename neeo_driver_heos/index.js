'use strict';

const neeoapi = require('neeo-sdk');
const controller = require('./controller');



console.log('NEEO SDK Example "HEOS" adapter');
console.log('---------------------------------------------');


const discoveryInstructions = {
  headerText: 'HEOS (TESTING)',
  description: 'Warning: this is a Testimplementation only'
};

/*
 * A Very simple Telnet adapter to control a HEOS.
  */

 const addButtons = controller.heosCommands();



 let heosDevice= neeoapi.buildDevice('HEOS')
  .setManufacturer('Denon')
  .addAdditionalSearchToken('foo')
  .setType('AUDIO')
  .addTextLabel({ name: 'artistLabel', label: 'Artist' }, controller.getArtist)
  .addTextLabel({ name: 'songLabel', label: 'Song' }, controller.getSong)
  .addTextLabel({ name: 'albumLabel', label: 'Album' }, controller.getAlbum)
  .addImageUrl({ name: 'albumcover', label: 'Cover', size: 'small' },controller.getImageUri)
  .registerSubscriptionFunction(controller.registerStateUpdateCallback)
  .enableDiscovery(discoveryInstructions, controller.discoverHeosPlayers);

  for (var i in addButtons) {
    heosDevice.addButton({ name: addButtons[i].neeo, label: addButtons[i].neeo });
  }

    heosDevice.addButtonHander(controller.heosDeviceButtonPressed);


function startSdkExample(brain) {
        console.log('- Start server');
        neeoapi.startServer({
          brain,
          port: 6336,
          name: 'simple-adapter-one',
      	  devices: [heosDevice]

        })
        .then(() => {
          console.log('# READY! use the NEEO app to search for "HEOS".');
        })
        .catch((error) => {
          //if there was any error, print message out to console
          console.error('ERROR!', error.message);
          process.exit(1);
        });

}




const brainIp = process.env.BRAINIP;
//const brainIp = config.neeo.brainIp ;
if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startSdkExample(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      startSdkExample(brain);
    });
}
