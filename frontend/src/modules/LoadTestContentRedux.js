import { addressBookJson } from "./sampleEmibJson";
import { recursivelyCreateAddressBook } from "../helpers/transformations";

// Action Types
const UPDATE_TEST_META_DATA = "emibInbox/UPDATE_TEST_META_DATA";
const UPDATE_TEST_BACKGROUND = "emibInbox/UPDATE_TEST_BACKGROUND";

// Action Creators
const updateTestMetaDataState = testMetaData => ({ type: UPDATE_TEST_META_DATA, testMetaData });
const updateTestBackgroundState = testBackground => ({
  type: UPDATE_TEST_BACKGROUND,
  testBackground
});

const getTestMetaData = testName => {
  return async function() {
    let metaDataContent = await fetch(`/api/test-meta-data/?test_name=${testName}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
      cache: "default"
    });
    return await metaDataContent.json();
  };
};

const getTestContent = testName => {
  return async function() {
    let testContent = await fetch(`/api/test-questions/?test_name=${testName}`, {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
      cache: "default"
    });
    return await testContent.json();
  };
};

// Initial State
// testMetaData contains the name of the test and the overview page content
// testBackground contains all the background information
const initialState = {
  isMetaLoading: true,
  testMetaData: {},
  testBackground: {},
  addressBook: addressBookJson.addressBookEN
};

// Reducer
const loadTestContent = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TEST_META_DATA:
      return {
        ...state,
        testMetaData: action.testMetaData,
        isMetaLoading: false
      };
    case UPDATE_TEST_BACKGROUND:
      return {
        ...state,
        testBackground: action.testBackground,
        addressBook: processAddressBook(action.testBackground)
      };

    default:
      return state;
  }
};

// Converts the org charts in the background into an addressBook
const processAddressBook = testBackground => {
  // Get the org charts out of the background.
  const enOrgCharts = testBackground.en.background[0].tree_view;
  const frOrgCharts = testBackground.fr.background[0].tree_view;

  // Flatten the trees and get rid of duplicates
  // Format like an address book
  const addressBookA = recursivelyCreateAddressBook(
    enOrgCharts[0].organizational_structure_tree_child,
    frOrgCharts[0].organizational_structure_tree_child,
    "organizational_structure_tree_child"
  );
  const addressBookB = recursivelyCreateAddressBook(
    enOrgCharts[1].team_information_tree_child,
    frOrgCharts[1].team_information_tree_child,
    "team_information_tree_child"
  );
  const addressBook = addressBookA.concat(addressBookB);

  // Return the formatted address book
  return addressBook;
};

export default loadTestContent;
export {
  initialState,
  updateTestMetaDataState,
  getTestMetaData,
  updateTestBackgroundState,
  getTestContent
};
