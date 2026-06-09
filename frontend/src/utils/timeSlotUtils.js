/**
 * Time Slot Utility Functions
 * Handles smart delivery time slot logic with same-day 2-hour buffer
 */

// Store Pickup Timings: 10:00 AM – 10:00 PM
const STORE_PICKUP_START = 10; // 10 AM
const STORE_PICKUP_END = 22; // 10 PM

// Home Delivery Timings: 12:00 PM – 9:00 PM
const HOME_DELIVERY_START = 12; // 12 PM
const HOME_DELIVERY_END = 21; // 9 PM

// Same-day delivery requires minimum 2-hour advance order
const SAME_DAY_BUFFER_HOURS = 2;

/**
 * Define all available time slots for the bakery
 * Format: HH:00-HH:00 (24-hour format)
 */
export const ALL_TIME_SLOTS = [
  { id: 1, label: '10:00 AM – 12:00 PM', value: '10:00-12:00', startHour: 10, endHour: 12 },
  { id: 2, label: '12:00 PM – 2:00 PM', value: '12:00-14:00', startHour: 12, endHour: 14 },
  { id: 3, label: '2:00 PM – 4:00 PM', value: '14:00-16:00', startHour: 14, endHour: 16 },
  { id: 4, label: '4:00 PM – 6:00 PM', value: '16:00-18:00', startHour: 16, endHour: 18 },
  { id: 5, label: '6:00 PM – 8:00 PM', value: '18:00-20:00', startHour: 18, endHour: 20 },
  { id: 6, label: '8:00 PM – 10:00 PM', value: '20:00-22:00', startHour: 20, endHour: 22 }
];

/**
 * Get current date as YYYY-MM-DD string
 */
export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Check if delivery date is today
 * @param {string} deliveryDate - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
export const isSameDayDelivery = (deliveryDate) => {
  return deliveryDate === getTodayDateString();
};

/**
 * Get current time in 24-hour format
 * @returns {number} Current hour (0-23)
 */
export const getCurrentHour = () => {
  const now = new Date();
  return now.getHours();
};

/**
 * Get current minutes
 * @returns {number} Current minutes (0-59)
 */
export const getCurrentMinutes = () => {
  const now = new Date();
  return now.getMinutes();
};

/**
 * Check if a time slot is available for same-day delivery
 * Considers the 2-hour buffer requirement
 * @param {object} timeSlot - Time slot object with startHour and endHour
 * @param {string} deliveryType - 'store_pickup' or 'home_delivery'
 * @returns {boolean}
 */
export const isTimeSlotAvailableForSameDay = (timeSlot, deliveryType) => {
  const currentHour = getCurrentHour();
  const currentMinutes = getCurrentMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinutes;
  
  // Calculate minimum required time (current time + 2 hours)
  const minimumTimeInMinutes = currentTimeInMinutes + (SAME_DAY_BUFFER_HOURS * 60);
  const slotStartTimeInMinutes = timeSlot.startHour * 60;

  // Slot must start after the 2-hour buffer
  if (slotStartTimeInMinutes < minimumTimeInMinutes) {
    return false;
  }

  return true;
};

/**
 * Filter time slots based on delivery type and same-day rules
 * @param {string} deliveryType - 'store_pickup' or 'home_delivery'
 * @param {string} deliveryDate - Date in YYYY-MM-DD format
 * @returns {array} Filtered array of available time slots
 */
export const getAvailableTimeSlots = (deliveryType, deliveryDate) => {
  const isSameDay = isSameDayDelivery(deliveryDate);

  // Get operating hours based on delivery type
  let operatingStart, operatingEnd;
  if (deliveryType === 'takeaway') {
    operatingStart = STORE_PICKUP_START;
    operatingEnd = STORE_PICKUP_END;
  } else {
    operatingStart = HOME_DELIVERY_START;
    operatingEnd = HOME_DELIVERY_END;
  }

  // Filter slots by operating hours
  let availableSlots = ALL_TIME_SLOTS.filter(
    slot => slot.startHour >= operatingStart && slot.endHour <= operatingEnd
  );

  // If same-day, apply 2-hour buffer rule
  if (isSameDay) {
    availableSlots = availableSlots.filter(slot =>
      isTimeSlotAvailableForSameDay(slot, deliveryType)
    );
  }

  return availableSlots;
};

/**
 * Check if any time slots are available for a given date and delivery type
 * @param {string} deliveryType - 'store_pickup' or 'home_delivery'
 * @param {string} deliveryDate - Date in YYYY-MM-DD format
 * @returns {boolean}
 */
export const areTimeSlotAvailable = (deliveryType, deliveryDate) => {
  const availableSlots = getAvailableTimeSlots(deliveryType, deliveryDate);
  return availableSlots.length > 0;
};

/**
 * Get a formatted message when no time slots are available
 * @param {string} deliveryType - 'store_pickup' or 'home_delivery'
 * @param {string} deliveryDate - Date in YYYY-MM-DD format
 * @returns {string} Formatted message
 */
export const getNoSlotsMessage = (deliveryType, deliveryDate) => {
  const isSameDay = isSameDayDelivery(deliveryDate);

  if (isSameDay) {
    return `Same-day ${deliveryType === 'takeaway' ? 'store pickup' : 'delivery'} slots are no longer available. Please choose another date.`;
  }

  return `No ${deliveryType === 'takeaway' ? 'store pickup' : 'delivery'} slots available for this date.`;
};

/**
 * Format time slot value (e.g., "14:00-16:00") to readable format
 * @param {string} timeSlotValue - Time slot value in HH:00-HH:00 format
 * @returns {string} Readable format or original value
 */
export const formatTimeSlot = (timeSlotValue) => {
  const slot = ALL_TIME_SLOTS.find(s => s.value === timeSlotValue);
  return slot ? slot.label : timeSlotValue;
};
