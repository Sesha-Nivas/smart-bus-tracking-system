function calculateETA(distance, speed) {

  const timeInHours = distance / speed;
  const timeInMinutes = timeInHours * 60;

  return Math.round(timeInMinutes);
}

module.exports = calculateETA;