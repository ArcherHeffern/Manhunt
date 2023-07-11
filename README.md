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
