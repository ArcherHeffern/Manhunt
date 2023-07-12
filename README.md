# Manhunt

Manhunt is a twist on hide and seek where Hunters and Runners can digitally track the closest member of the other team. Play with 2-15 players. Suitable for games in large area such as college campus' or IKEAs!

### WINNING
Hunters win by tracking down all the runners before the time limit is up and Runners win by avoiding the hunters until the time limit is up.

### TRACKING SYSTEM
The relative direction, and optionally the distance of the nearest member of the opposing team is broadcasted at a constant interval, to each member of a team. This it less tag-like and more of a tracking game.

### MULTIPLE MODES!
* Lone Hunter: One Hunter, everyone else is a Runner
* Solo Evasion: One Runner, everyone else is a Hunter
* Custom game: can set any game variable

### PLANNED FEATURES
* Gamemode: Infection, runners when found are converted to hunters
* Transition to using Redis for storing games on backend
* Transition to using Nginx for load balancing
* Deploy to app and play store
* Player can create an account
* Tracker performance and mathematical improvements
* Revamp "tagging" system where hunters must take a picture of every runner

### Stack
React-native (frontend), node, socket.io, express (backend), linode (devops), typescript (full stack)

### Images

![IMG_4706](https://github.com/ArcherHeffern/Manhunt/assets/105125483/9b7d30e0-67fc-4374-8404-1a1ef26142e8)
![IMG_4709](https://github.com/ArcherHeffern/Manhunt/assets/105125483/69700919-a098-48b9-9180-e9fc31598f43)
![IMG_4710](https://github.com/ArcherHeffern/Manhunt/assets/105125483/131b4b01-3139-471c-a351-a08cb7fb87ce)
![IMG_4711](https://github.com/ArcherHeffern/Manhunt/assets/105125483/25275b9e-26f2-44e4-a7cf-afb7194a283b)
