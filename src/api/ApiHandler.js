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
//
export const getAddressFromLatLng = async (latitude, longitude) => {
  try{
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    const response = await axios.get(url);
    return response?.data?.results[0].formatted_address || ""
  }catch (error) {
    return "";
  }
};