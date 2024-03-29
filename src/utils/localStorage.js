/*
 * @copyRight by md sarwar hoshen.
 */

// Set item
export const setItem = async (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error setting item with key ${key}:`, e);
  }
};
// Get item
export const getItem = async (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.error(`Error getting item with key ${key}:`, e);
    return null;
  }
};
// Remove item
export const removeItem = async (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error deleting item with key ${key}:`, e);
  }
};
