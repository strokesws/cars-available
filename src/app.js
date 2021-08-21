import "core-js/stable";
import "regenerator-runtime/runtime";

import "./styles/styles.scss";

document.addEventListener("DOMContentLoaded", async () => {
  /*
   * Remove loader and displays car grid
   */
  const removeLoader = () => {
    document.querySelector(".loader").remove();
    const carGrid = document.querySelector("#car-grid");
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
   * Renders list of cars on the HTML
   * @param {array} carList List of cars to be rendered
   */
  const renderCarList = (carList) => {
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
      // PICTURE
      clone
        .querySelector(".car-card__picture")
        .setAttribute("src", Vehicle.PictureURL);

      // ESTIMATED TOTAL
      const currencyOptions = {
        currency: car.TotalCharge["@CurrencyCode"],
        style: "currency",
      };
      const estimatedTotal = new Intl.NumberFormat(
        locale,
        currencyOptions
      ).format(car.TotalCharge["@EstimatedTotalAmount"]);
      clone.querySelector(".car-card__value").textContent = estimatedTotal;

      // render
      const carGrid = document.querySelector("#car-grid");
      carGrid.appendChild(clone);
    });
  };

  const data = await getCars();

  if (!data && !data.length) return removeLoader();
  const flatCarList = parseCarList(data[0].VehAvailRSCore.VehVendorAvails);
  renderCarList(flatCarList);
  removeLoader();
});
