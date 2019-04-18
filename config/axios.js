import axios from "axios";

// const url = "101.132.168.103:7877";
const url = "192.168.0.104:8081"; // 小伍
export default axios.create({
  baseURL: `http://${url}`,
  timeout: 23000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true
  }
});
