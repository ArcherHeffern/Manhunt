import { Player } from '../../frontend/types';

export default function findClosestPlayer(target: Player, players: Player[]): Player {
  let closestPlayer: Player = {id: '', name: '', location: {lat: 0, lng: 0}};
  let closestDistance = Infinity;
  for (const player of players) {
    if (player.id === target.id) {
      continue;
    }
    const distance = getDistance(target.location, player.location);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPlayer = player;
    }
  }
  return closestPlayer;
}

function getDistance(location1: Player['location'], location2: Player['location']): number {
  const lat1 = location1?.lat || 0;
  const lng1 = location1?.lng || 0;
  const lat2 = location2?.lat || 0;
  const lng2 = location2?.lng || 0;
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians 
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in metres
}