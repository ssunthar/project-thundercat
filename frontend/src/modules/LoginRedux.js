import { PATH } from "../App";

// Action Types
// AUTH ACTIONS
export const AUTHENTICATED = "AUTHENTICATED";
export const UNAUTHENTICATED = "UNAUTHENTICATED";
export const REGISTRATION = "REGISTRATION";
//CHANGE PASSWORD ACTIONS
export const IS_CHANGING_PASSWORD = "IS_CHANGING_PASSWORD";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";
export const CHANGE_PASSWORD_FAILURE = "CHANGE_PASSWORD_FAILURE";

// saves the authentication token in local storage, redirects to dashbord page and update authenticated state to true
function handleAuthResponseAndState(response, dispatch, location, push) {
  return async function() {
    if (navigator.cookieEnabled) {
      localStorage.setItem("auth_token", response.token);
    }

    if (location === PATH.login) {
      push(PATH.dashboard);
    }
    return dispatch(authenticateAction(true));
  };
}

// updates authenticated state
const authenticateAction = authenticated => ({ type: AUTHENTICATED, authenticated });

function registerAction(data) {
  return async function() {
    let response = await fetch("/api/auth/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let responseJson = response.json();
    return responseJson;
  };
}

// updates pageHasError state
const updatePageHasErrorState = pageHasError => ({
  type: REGISTRATION,
  pageHasError
});

// getting user's token
function loginAction(data) {
  return async function() {
    let response = await fetch("/api/auth/jwt/create_token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let responseJson = await response.json();
    return responseJson;
  };
}

// getting user's information (id, first name, last name, birth date, email, username and pri or military number)
function getUserInformation(token) {
  return async function() {
    let accountInfo = await fetch("/api/auth/me/", {
      method: "GET",
      headers: {
        Authorization: "JWT " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
        cache: "default"
      }
    });
    let accountInfoResponseJson = await accountInfo.json();
    return accountInfoResponseJson;
  };
}

// JWT tokens are not stored in our DB
function logoutAction() {
  localStorage.removeItem("auth_token");
  return { type: UNAUTHENTICATED };
}

// Initial State
const initialState = {
  authenticated: false,
  pageHasError: false
};

// Reducer
const login = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return {
        ...state,
        authenticated: action.authenticated
      };
    case UNAUTHENTICATED:
      return { authenticated: false };
    case REGISTRATION:
      return {
        ...state,
        pageHasError: action.pageHasError
      };

    default:
      return state;
  }
};

export default login;
export {
  initialState,
  registerAction,
  loginAction,
  authenticateAction,
  handleAuthResponseAndState,
  logoutAction,
  getUserInformation,
  updatePageHasErrorState
};
