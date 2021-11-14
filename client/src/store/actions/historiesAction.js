import axios from "axios";
import { SET_HISTORIES } from "../actionType";
const server = process.env.REACT_APP_BASE_URL;

export function setHistories(payload) {
  return {
    type: SET_HISTORIES,
    payload,
  };
}

export function fetchHistories() {
  const access_token = localStorage.getItem("access_token");
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios({
        url: `${server}/histories`,
        headers: {
          access_token,
        },
      })
        .then((result) => {
          dispatch(setHistories(result.data));
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    });
  };
}

export function deleteHistory(id) {
  const access_token = localStorage.getItem("access_token");
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "DELETE",
        url: `${server}/histories/${id}`,
        headers: {
          access_token,
        },
      })
        .then((result) => {
          console.log(result);
          const newHistory = getState().historyReducer.histories.filter((history) => history._id !== id);
          dispatch(setHistories(newHistory));
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    });
  };
}
