/*
 * @copyRight by md sarwar hoshen.
 */
import { usePlacesWidget } from "react-google-autocomplete";

export default (props) => {
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
    //   //console.log(place);
      const obj = {
        line1: "",
        line2: "",
        city: "",
        county: "",
        country: "",
        postal_code: "",
        lat_lng: "",
        formatted_address: ""
      }
      place.address_components.map((item,index)=>{
        if(item.types.includes("street_number")){
            obj.line1 = item.long_name
        }
        if(item.types.includes("route")){
            obj.line2 = item.long_name
        }
        if(item.types.includes("postal_town")){
            obj.city = item.long_name
        }
        if(item.types.includes("administrative_area_level_2")){
            obj.county = item.long_name
        }
        if(item.types.includes("country")){
            obj.country = item.long_name
        }
        if(item.types.includes("postal_code")){
            obj.postal_code = item.long_name
        }
      })
      obj.lat_lng = [place.geometry.location.lat(), place.geometry.location.lng()]
      obj.formatted_address = place.formatted_address

      props.onPlaceSelected(obj)
    },
    options: {
      types:["geocode", "establishment"],
      componentRestrictions: { country: "uk" },
    },
  });

  return (
    <input
      placeholder="Search Address"
      className="form-control"
      ref={ref}
    />
  );
};
