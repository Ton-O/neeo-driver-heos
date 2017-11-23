# neeo-driver-heos


This app Integrates Denon HEOS Speakers into the NEEO Universe. This is the first implementation of the Driver, thus likely to crash witout any reason or warnigns.
If you have any tips or tricks to bring this driver to a bether level, feel free to contact me.

Please note that this is not an official NEEO app made by NEEO and there will be no support from NEEO concerning this App.

Instructions

Step 1

Enable the “Audio” device in “*/node_modules/neeo-sdk/lib/device/devicetype/Index.js” to be inline with the below

const TYPES = [

  'ACCESSOIRE',
  
  'LIGHT',
  
  'MEDIAPLAYER',
  
  'TV',
  
  'AVRECEIVER',
  
  'AUDIO'

];


Step 2

Start the Driver

Note: It can happen that the Driver does not discover the Brain or at least one Speaker. In that case, please restart the Driver until you get the "READY!" message and at least one disvocered Device.
Discovered Devices look like this:


Discovered Device:  { friendlyName: 'Wohnzimmer',

  modelName: 'HEOS 1',
  
  modelNumber: 'DWS-1000 4.0',
  
  deviceId: 'AIOS:0001',
  
  wlanMac: '00:05:CD:6D:AF:0E',
  
  address: '192.168.1.12',
  
  instance: '192.168.1.12' }
  

Note2: If you have Problems discovering the Brain, just set your BrainIP in the Config and toggle comments on index.js Line 66 & 67

Step 3

Add the Device in Neeo

Step 4

Set the Recipe from the new Device to "On" and choose "Show on Homescreen"

Step 5

Start the Recipe and add the following Shortcuts:
Transport
Cover
Now Playing
Skip Backward
Skip Forward

Step 6

Have Fun!

