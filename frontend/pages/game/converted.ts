function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians: number) {
    return radians * (180 / Math.PI);
}

type Coordinate = {
    latitude: number;
    longitude: number;
}

export default function convertToHeading(a: Coordinate, b: Coordinate, myHeading: number) {
    const deltaL = toRadians(b.longitude) - toRadians(a.longitude);
    const thetaB = toRadians(b.latitude);
    const thetaA = toRadians(a.latitude);
    const x = Math.cos(thetaB) * Math.sin(deltaL);
    const y = Math.cos(thetaA) * Math.sin(thetaB) - Math.sin(thetaA) * Math.cos(thetaB) * Math.cos(deltaL);
    const bearing = Math.atan2(x, y);
    const bearingInDegrees = toDegrees(bearing);
    return bearingInDegrees + myHeading;
}