import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Confirmation from "./Confirmation";
import EmibTabs from "./EmibTabs";
import TestFooter from "../commons/TestFooter";
import LOCALIZE from "../../text_resources";
import ContentContainer from "../commons/ContentContainer";
import PopupBox, { BUTTON_TYPE } from "../commons/PopupBox";
import { activateTest, deactivateTest, PAGES } from "../../modules/TestStatusRedux";
import ConfirmStartTest from "../commons/ConfirmStartTest";
import EmibIntroductionPage from "./EmibIntroductionPage";
import { Helmet } from "react-helmet";
import {
  updateEmailsEnState,
  updateEmailsFrState,
  updateEmailsState
} from "../../modules/EmibInboxRedux";
import { getTestContent, updateTestBackgroundState } from "../../modules/LoadTestContentRedux";
import QuitConfirmation from "../commons/QuitConfirmation";
import { TEST_DEFINITION } from "../../testDefinition";

class Emib extends Component {
  static propTypes = {
    testNameId: PropTypes.string,
    // Provided by Redux
    activateTest: PropTypes.func.isRequired,
    deactivateTest: PropTypes.func.isRequired,
    curPage: PropTypes.string.isRequired,
    updateEmailsEnState: PropTypes.func,
    updateEmailsFrState: PropTypes.func,
    updateEmailsState: PropTypes.func,
    getTestContent: PropTypes.func,
    updateTestQuestionsState: PropTypes.func
  };

  state = {
    currentTab: "instructions",
    disabledTabs: [1, 2],
    testIsStarted: false,
    showStartTestPopup: false,
    showSubmitPopup: false
  };

  /* Within eMIB Tabs functions
  loading test questions from the APIs on test start */
  handleStartTest = () => {
    const testNameId = this.props.testNameId
      ? this.props.testNameId
      : TEST_DEFINITION.emib.sampleTest;
    // getting questions of the sample test from the api
    this.props.getTestContent(testNameId).then(response => {
      // Load emails.
      // TODO: default language is English for now, but we'll need to put the landing page selected language here instead
      this.props.updateEmailsState(response.questions.en.email);
      // saving questions content in emails, emailsEN and emailsFR states
      this.props.updateEmailsEnState(response.questions.en.email);
      this.props.updateEmailsFrState(response.questions.fr.email);

      // Load background info.
      this.props.updateTestBackgroundState(response.background);

      // Update state.
      this.setState({ testIsStarted: true, disabledTabs: [], currentTab: "background" });
    });
  };

  closePopup = () => {
    this.setState({ showSubmitPopup: false, showQuitPopup: false });
  };

  switchTab = tabId => {
    this.setState({ currentTab: tabId });
  };

  openStartTestPopup = () => {
    this.setState({ showStartTestPopup: true });
  };

  closeStartTestPopup = () => {
    this.setState({ showStartTestPopup: false });
  };

  // Leaving the eMIB functions
  openSubmitPopup = () => {
    this.setState({ showSubmitPopup: true });
  };

  render() {
    return (
      <div className="app">
        <Helmet>
          <title>{LOCALIZE.titles.eMIB}</title>
        </Helmet>
        {this.props.curPage === PAGES.emibTabs && (
          <EmibTabs
            currentTab={this.state.currentTab}
            switchTab={this.switchTab}
            disabledTabsArray={this.state.disabledTabs}
          />
        )}
        {this.props.curPage !== PAGES.emibTabs && (
          <ContentContainer hideBanner={false}>
            {this.props.curPage === PAGES.preTest && (
              <EmibIntroductionPage
                testNameId={this.props.testNameId}
                nextPage={this.props.activateTest}
              />
            )}

            {this.props.curPage === PAGES.confirm && <Confirmation />}
            {this.props.curPage === PAGES.quit && <QuitConfirmation />}
          </ContentContainer>
        )}
        {this.props.curPage === PAGES.emibTabs && (
          <TestFooter
            startTest={this.openStartTestPopup}
            submitTest={this.openSubmitPopup}
            testIsStarted={this.state.testIsStarted}
          />
        )}

        <ConfirmStartTest
          showDialog={this.state.showStartTestPopup}
          handleClose={this.closeStartTestPopup}
          startTest={this.handleStartTest}
        />

        <PopupBox
          show={this.state.showSubmitPopup}
          handleClose={this.closePopup}
          title={LOCALIZE.emibTest.testFooter.submitTestPopupBox.title}
          description={
            <div>
              <p>{LOCALIZE.emibTest.testFooter.submitTestPopupBox.warning.message}</p>
              <p>{LOCALIZE.emibTest.testFooter.submitTestPopupBox.description}</p>
            </div>
          }
          leftButtonType={BUTTON_TYPE.secondary}
          leftButtonTitle={LOCALIZE.commons.cancel}
          rightButtonType={BUTTON_TYPE.primary}
          rightButtonTitle={LOCALIZE.commons.submitTestButton}
          rightButtonAction={this.props.deactivateTest}
        />
      </div>
    );
  }
}

export { Emib as UnconnectedEmib };

const mapStateToProps = (state, ownProps) => {
  return {
    curPage: state.testStatus.currentPage
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      activateTest,
      deactivateTest,
      updateEmailsEnState,
      updateEmailsFrState,
      updateEmailsState,
      getTestContent,
      updateTestBackgroundState
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Emib);
