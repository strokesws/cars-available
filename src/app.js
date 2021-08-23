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
  const modal = document.querySelector(".modal");
  modal.removeAttribute("style");
};

const toggleModal = () => {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("opacity-0");
  modal.classList.toggle("pointer-events-none");
};

const displayDetails = () => {
  toggleModal();
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await getCars();

  if (!data && !data.length) return removeLoader();
  const { VehRentalCore, VehVendorAvails } = data[0].VehAvailRSCore;

  const booking = parseBooking(VehRentalCore);
  renderBookingDetails(booking);

  const flatCarList = parseCarList(VehVendorAvails);
  const sortedList = sortCarList(flatCarList, "price");
  renderCarList(sortedList, booking, "#car-grid");

  const body = document.querySelector("body");
  body.addEventListener("click", (event) => {
    const { className } = event.target;
    if (className.includes("car-card__more-details")) {
      const carCode = event.target.getAttribute("data-car-code");
      displayDetails(carCode);
    } else if (className.includes("modal__close")) {
      toggleModal();
    }
  });

  removeLoader();
});
