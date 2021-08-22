/*
 * Add number of days to booking information
 * @param {object} booking Booking information
 * return {object} booking with days
 */
export const parseBooking = (booking) => {
  const d1 = new Date(booking["@PickUpDateTime"]);
  const d2 = new Date(booking["@ReturnDateTime"]);

  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = d2.getTime() - d1.getTime();
  booking.days = Math.round(diffInTime / oneDay);
  return booking;
};

/*
 * Renders booking details
 * @param {object} booking Booking details
 */
export const renderBookingDetails = (booking) => {
  // DAYS
  document.querySelector(".booking-details__days").textContent = `${
    booking.days
  } ${booking.days > 1 ? "days" : "day"}`;

  // PICK UP LOCATION
  document.querySelector(".booking-details__pick-up-location").textContent =
    booking.PickUpLocation["@Name"];

  // PICK UP DATE TIME
  const pickUpDateTime = new Date(booking["@PickUpDateTime"]).toLocaleString();
  document.querySelector(".booking-details__pick-up-date-time").textContent =
    pickUpDateTime;

  // RETURN LOCATION
  document.querySelector(".booking-details__return-location").textContent =
    booking.ReturnLocation["@Name"];

  // RETURN DATE TIME
  const returnDateTime = new Date(booking["@ReturnDateTime"]).toLocaleString();
  console.log(booking);
  document.querySelector(".booking-details__return-date-time").textContent =
    returnDateTime;
};
