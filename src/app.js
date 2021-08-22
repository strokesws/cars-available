import "core-js/stable";
import "regenerator-runtime/runtime";

import "./styles/styles.scss";

/*
 * Remove loader and displays car grid
 */
const removeLoader = () => {
  document.querySelector(".loader").remove();
  const carGrid = document.querySelector("#app");
  carGrid.classList.remove("hidden");
};

/*
 * Get list of car availabl
 * @return {array | null} Booking meta data and cars available
 */
const getCars = async () => {
  try {
    const response = await fetch("http://www.cartrawler.com/ctabe/cars.json");
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(err);
  }
};

/*
 * Add number of days to booking information
 * @param {object} booking Booking information
 * return {object} booking with days
 */
const parseBooking = (booking) => {
  const d1 = new Date(booking["@PickUpDateTime"]);
  const d2 = new Date(booking["@ReturnDateTime"]);

  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = d2.getTime() - d1.getTime();
  booking.days = Math.round(diffInTime / oneDay);
  return booking;
};

/*
 * Parses the list of vendors and cars into a flat array
 * @param {object} vendorList List of vendors with available cars
 * @return {array} List of cars available
 */
const parseCarList = (vendorList) =>
  vendorList.reduce((accu, vendor) => {
    const vendorName = vendor.Vendor["@Name"];
    const flatCarList = vendor.VehAvails.map((car) => {
      car.vendorName = vendorName;
      return car;
    });

    return accu.concat(flatCarList);
  }, []);

/*
 * Sorts list of cars
 * @param {array} Flat list of cars
 * @param {string} Property to sort by: prince
 * @return {array} Sorted carList
 */
const sortList = (carList, sortBy) =>
  carList.sort((a, b) => {
    switch (sortBy) {
      case "price":
      default:
        return (
          +a.TotalCharge["@EstimatedTotalAmount"] -
          +b.TotalCharge["@EstimatedTotalAmount"]
        );
        break;
    }
  });

/*
 * Renders list of cars on the HTML
 * @param {array} carList List of cars to be rendered
 * @param {object} booking Booking information
 */
const renderCarList = (carList, booking) => {
  const template = document.querySelector("#car-card-template");
  // To be used in the currency format
  const locale = window.navigator.userLanguage || window.navigator.language;

  carList.forEach((car) => {
    const clone = template.content.cloneNode(true);
    const { Vehicle } = car;

    // NAME
    clone.querySelector(".car-card__name").textContent =
      Vehicle.VehMakeModel["@Name"];
    // TRANSMISSION TYPE
    clone.querySelector(".car-card__transmission-type").textContent =
      Vehicle["@TransmissionType"];
    // FUEL TYP
    clone.querySelector(".car-card__fuel-type").textContent =
      Vehicle["@FuelType"];
    //PASSENGER QUANTITY
    clone.querySelector(".car-card__passenger-quantity").textContent =
      Vehicle["@PassengerQuantity"];
    // BAGGAGE QUANTITY
    clone.querySelector(".car-card__baggage-quantity").textContent =
      Vehicle["@BaggageQuantity"];
    // DOOR COUNT
    clone.querySelector(".car-card__door-count").textContent =
      Vehicle["@DoorCount"];

    // AIR CONDITIONING
    if (!!Vehicle["@AirConditionInd"]) {
      clone
        .querySelector(".car-card__air-conditioning")
        .classList.remove("hidden");
    }

    // PICTURE
    clone
      .querySelector(".car-card__picture")
      .setAttribute("src", Vehicle.PictureURL);

    // ESTIMATED TOTAL
    const totalPerDay = car.TotalCharge["@EstimatedTotalAmount"] / booking.days;
    const currencyOptions = {
      currency: car.TotalCharge["@CurrencyCode"],
      style: "currency",
    };
    const estimatedTotal = new Intl.NumberFormat(
      locale,
      currencyOptions
    ).format(totalPerDay);
    clone.querySelector(
      ".car-card__value"
    ).textContent = `${estimatedTotal}/day`;

    //VENDOR
    clone.querySelector(".car-card__vendor").textContent = car.vendorName;

    // render
    const carGrid = document.querySelector("#car-grid");
    carGrid.appendChild(clone);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = await getCars();

  if (!data && !data.length) return removeLoader();
  const { VehAvailRSCore } = data[0];

  const booking = parseBooking(VehAvailRSCore.VehRentalCore);

  const flatCarList = parseCarList(VehAvailRSCore.VehVendorAvails);
  const sortedList = sortList(flatCarList, "price");
  renderCarList(sortedList, booking);
  removeLoader();
});
