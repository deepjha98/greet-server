import axios from "axios";
const videoAction = async (action, value) =>{
  try {
    const { data } = await axios.post("https://precisely.one/api/v1/add_in_video_action", {
      // event_id: 1,
      room_id: localStorage.getItem("roomId"),
      action: action,
      value: value
    }, {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
      }
    });
    console.log("fromServer",data);
  } catch (error) {
    if(error.response){
      console.log(error.response.data)
    }
  }
  console.log("Events");
}

export default videoAction;