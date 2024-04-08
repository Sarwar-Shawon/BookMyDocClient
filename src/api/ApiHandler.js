/*
 * @copyRight by md sarwar hoshen.
 */

import axios from 'axios';
import api from './api';

// Post method
export const Post = async (url, arg , ContentType) => {
  try {
    const config = {
      headers: {
        'Content-Type': ContentType || 'multipart/form-data', 
      },
      withCredentials: true,
    };
    
    const response = await api.post(url, arg,config);
    // console.log("response",response);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("err", error);
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};
// Post method
export const Put = async (url, arg , ContentType) => {
  try {
    const config = {
      headers: {
        'Content-Type': ContentType || 'multipart/form-data'
      },
      withCredentials: true,
    };
    
    const response = await api.put(url, arg , config);
    // console.log("response",response);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("err", error);
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};
// Get method
export const Get = async (url) => {
  try {
    const response = await api.get(url,{
      withCredentials: true, 
    });
    // console.log('response', response.data);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("err", error);
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};
// Delete method
export const Delete = async (url, arg) => {
  try {
    const response = await api.delete(url,{
      withCredentials: true, 
    });
    // console.log("response",response);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    console.log("err", error);
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};
// Unauth Post method
export const PublicPost = async (url, arg) => {
  try {

    const response = await axios.post(url, arg,{
      withCredentials: true, 
    });
    // console.log("response",response);
    if (response.data.success) {
      return response.data;
    }
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};
// Unauth Get method
export const PublicGet = async (url) => {
  try {
    const response = await axios.get(url);
    if (response?.data.success)
       return response.data;;
  } catch (error) {
    return {
      success: false,
      error: error?.response?.data?.error || error?.message,
    };
  }
};

// Function to search for a medicine by name
export async function searchMedicineByName(medicineName) {
  try {
    const response = await axios.get(`https://api.fda.gov/drug/label.json?search=generic_name:${medicineName}`);
    console.log("responseresponseresponse:::", response)

    const medicineList = response.data.results.map(result => result.openfda.generic_name);
    console.log(medicineList);
    return medicineList;

    return medicineList;
  } catch (error) {
    console.error('Error searching for medicine:', error);
    return [];
  }
}

// Call the function with the medicine name you want to search for
