/*
 * Get list of car availabl
 * @return {array | null} Booking meta data and cars available
 */
export const getCars = async () => {
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
export const parseCarList = (vendorList) =>
  vendorList.reduce((accu, vendor) => {
    const vendorName = vendor.Vendor["@Name"];
    const vendorCode = vendor.Vendor["@Code"];
    const flatCarList = vendor.VehAvails.map((car) => {
      car.vendorName = vendorName;
      car.code = `${vendorCode}-${car.Vehicle["@Code"]}`;
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
export const sortCarList = (carList, sortBy) =>
  carList.sort((a, b) => {
    // TODO: add more sorting options
    switch (sortBy) {
      case "price":
      default:
        return (
          +a.TotalCharge["@EstimatedTotalAmount"] -
          +b.TotalCharge["@EstimatedTotalAmount"]
        );
    }
  });

/*
 * Renders list of cars on the HTML
 * @param {array} carList List of cars to be rendered
 * @param {object} booking Booking information
 * @param {object} renderSelector Selector where list should be rendered
 */
export const renderCarList = (carList, booking, renderSelector) => {
  const render = document.querySelector(renderSelector);
  const template = document.querySelector("#car-card-template");
  if (!render || !template) return;
  render.replaceChildren();

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

    clone
      .querySelector(".car-card__more-details")
      .setAttribute("data-car-code", car.code);

    // render
    render.appendChild(clone);
  });
};
