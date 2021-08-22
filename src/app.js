import "core-js/stable";
import "regenerator-runtime/runtime";
import { parseBooking, renderBookingDetails } from "./js/booking";
import { getCars, parseCarList, renderCarList, sortCarList } from "./js/cars";

import "./styles/styles.scss";

/*
 * Remove loader and displays car grid
 */
const removeLoader = () => {
  document.querySelector(".loader").remove();
  const carGrid = document.querySelector("#app");
  carGrid.removeAttribute("style");
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await getCars();

  if (!data && !data.length) return removeLoader();
  const { VehRentalCore, VehVendorAvails } = data[0].VehAvailRSCore;

  const booking = parseBooking(VehRentalCore);
  renderBookingDetails(booking);

  const flatCarList = parseCarList(VehVendorAvails);
  const sortedList = sortCarList(flatCarList, "price");
  renderCarList(sortedList, booking);
  removeLoader();
});
