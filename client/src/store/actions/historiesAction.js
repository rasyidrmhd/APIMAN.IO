import axios from "axios";
import { SET_HISTORIES, SET_HISTORIES_LOADING } from "../actionType";
import { server } from "../../apis/server";

export function setHistories(payload) {
  return {
    type: SET_HISTORIES,
    payload,
  };
}

export function loadingHistory(payload) {
  return {
    type: SET_HISTORIES_LOADING,
    payload,
  };
}

export function fetchHistories() {
  const access_token = localStorage.getItem("access_token");
  return (dispatch, getState) => {
    dispatch(loadingHistory(true));
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
        })
        .finally(() => {
          dispatch(loadingHistory(false));
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
          const newHistory = getState().historyReducer.histories.filter((history) => history._id !== id);
          dispatch(setHistories(newHistory));
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });
    });
  };
}

export function addNewHistory(addedHistory) {
  return (dispatch, getState) => {
    const newHistory = getState().historyReducer.histories;
    newHistory.unshift(addedHistory);
    dispatch(setHistories(newHistory));
  };
}

export function addToCollections(data) {
  const access_token = localStorage.getItem("access_token");
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      axios({
        method: "POST",
        url: `${server}/histories/collection`,
        headers: {
          access_token,
        },
        data,
      })
        .then((result) => {
          resolve(result.data);
        })
        .catch((err) => {
          reject(err.response.data.message);
        });
    });
  };
}
