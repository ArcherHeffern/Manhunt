# Manhunt
A hide and seek variant where the Hunter can digitally track Runners. Suitable for games in large area such as college campus' or IKEAs!

## Finer Details

*Creating a game*  
Select create game and input your game settings. Once you are happy with your settings, create the game, you will then be placed in a
waiting queue and be given a game code to share with your friends.
Settings: 
* Max Radius
* Game Time
* Max Players
* \# of Hunters

*Joining a game*  
Get a game code for a friend to join their game!

*Gameplay*  
The Runners will get a grace period to run from the Hunter, once the time period is up, the Hunter can move from the starting position,
and will start recieving location data from the server. The Hunter will get limited information about where the nearest Runner is, updated
periodically. The Runners will also recieve information about where the Hunter is, at a slower interval. The Hunter needs to take a picture
of a Runner to get them "out", and all Runners must be photographed before the time limit is up.

## Stack

Backend: 
node/express (server), Socket.io (full duplex communication), mongoDB (saving games and user data)

Frontend:
expo/react native

https://jamboard.google.com/d/1sb4QMX9r4g4-6h80OtIz6TV5eNWyPztaeuTQXJQWV_E/edit?usp=sharing
