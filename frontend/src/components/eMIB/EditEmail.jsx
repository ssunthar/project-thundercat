import React, { Component } from "react";
import PropTypes from "prop-types";
import LOCALIZE from "../../text_resources";
import { connect } from "react-redux";
import { EMAIL_TYPE, actionShape, EDIT_MODE } from "./constants";
import { transformAddressBook, optionsFromIds } from "../../helpers/transformations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faReplyAll, faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import ReactSuperSelect from "react-super-select";
import "../../css/lib/react-super-select.css";
import { getAddressInCurrentLanguage } from "../../modules/LoadTestContentRedux";

// These two consts limit the number of characters
// that can be entered into two text areas
// and are used to display <x>/<MAX>
// under the text areas
const MAX_RESPONSE = "3000";
const MAX_REASON = "650";

const styles = {
  header: {
    responseTypeIcons: {
      marginRight: 10,
      padding: 6,
      border: "1px solid #00565E",
      borderRadius: 4,
      cursor: "pointer",
      fontSize: 24
    },
    responseTypeIconsSelected: {
      backgroundColor: "#00565E",
      color: "white"
    },
    radioButtonZone: {
      marginBottom: 12
    },
    responseTypeRadio: {
      all: "unset",
      color: "#00565E",
      cursor: "pointer"
    },
    radioPadding: {
      marginBottom: 16
    },
    radioTextUnselected: {
      fontWeight: "normal",
      cursor: "pointer",
      paddingRight: 20,
      color: "#00565E"
    },
    radioTextSelected: {
      fontWeight: "bold",
      cursor: "pointer",
      paddingRight: 20,
      color: "#00565E"
    },
    fieldsetLegend: {
      fontSize: 16,
      marginBottom: 12,
      marginTop: 12,
      paddingTop: 12
    },
    titleStyle: {
      width: 28,
      height: 32,
      lineHeight: "2.1em",
      paddingRight: 4,
      marginTop: 5,
      marginBottom: 5
    },
    toAndCcFieldPadding: {
      marginBottom: 20
    }
  },
  response: {
    textArea: {
      padding: "6px 12px",
      border: "1px solid #00565E",
      borderRadius: 4,
      width: "100%",
      height: 225,
      resize: "none"
    }
  },
  textCounter: {
    width: "100%",
    textAlign: "right",
    paddingRight: 12
  },
  reasonsForAction: {
    textArea: {
      padding: "6px 12px",
      border: "1px solid #00565E",
      borderRadius: 4,
      width: "100%",
      height: 150,
      resize: "none"
    }
  },
  tooltipButton: {
    float: "right",
    textDecoration: "underline"
  }
};

class EditEmail extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    action: actionShape,
    originalFrom: PropTypes.string,
    originalTo: PropTypes.string,
    editMode: PropTypes.oneOf(Object.keys(EDIT_MODE)).isRequired,

    // Provided by redux
    addressBook: PropTypes.arrayOf(PropTypes.string)
  };

  componentDidMount() {
    // After generating the initial state, update the parent with it.
    // This allows defaults to be set.
    this.props.onChange(this.state);
  }

  // Generate an array of ids, representing contacts
  // based on a string of names in a to or from field.
  generateToIds = contactsString => {
    return contactsString.split(", ").map(name => {
      return this.props.addressBook.indexOf(name);
    });
  };

  state = {
    emailType: !this.props.action ? EMAIL_TYPE.reply : this.props.action.emailType,
    emailBody: !this.props.action
      ? ""
      : !this.props.action.emailBody
      ? ""
      : this.props.action.emailBody,
    emailTo: !this.props.action
      ? this.props.editMode === EDIT_MODE.create
        ? this.generateToIds(this.props.originalFrom)
        : []
      : this.props.action.emailTo,
    emailCc: !this.props.action ? [] : this.props.action.emailCc,
    reasonsForAction: !this.props.action
      ? ""
      : !this.props.action.reasonsForAction
      ? ""
      : this.props.action.reasonsForAction
  };

  onEmailTypeChange = event => {
    const newEmailType = event.target.value;

    // Names sent in the original email.
    const { originalTo, originalFrom } = this.props;

    // By default (and forwarding) should have a blank to field.
    let replyList = [];
    if (newEmailType === EMAIL_TYPE.reply) {
      // Reply to the person that sent you this email.
      replyList = this.generateToIds(originalFrom);
    } else if (newEmailType === EMAIL_TYPE.replyAll) {
      // Reply all to everyone this email was from and sent to.
      const toList = this.generateToIds(originalTo);
      const fromList = this.generateToIds(originalFrom);
      replyList = toList.concat(fromList);
    }

    this.setState({ emailType: newEmailType, emailTo: replyList });
    this.props.onChange({ ...this.state, emailType: newEmailType, emailTo: replyList });
  };

  onEmailToChange = options => {
    // Convert options to an array of indexes
    options = options || [];
    const idsArray = options.map(option => {
      return option.id;
    });
    this.setState({ emailTo: idsArray });
    this.props.onChange({ ...this.state, emailTo: idsArray });
  };

  onEmailCcChange = options => {
    // onvert options to an array of indexes
    options = options || [];
    const idsArray = options.map(option => {
      return option.id;
    });
    this.setState({ emailCc: idsArray });
    this.props.onChange({ ...this.state, emailCc: idsArray });
  };

  onEmailBodyChange = event => {
    const newEmailBody = event.target.value;
    this.setState({ emailBody: newEmailBody });
    this.props.onChange({ ...this.state, emailBody: newEmailBody });
  };

  onReasonsForActionChange = event => {
    const newreasonsForAction = event.target.value;
    this.setState({ reasonsForAction: newreasonsForAction });
    this.props.onChange({ ...this.state, reasonsForAction: newreasonsForAction });
  };

  render() {
    let { emailTo, emailCc, emailBody, reasonsForAction } = this.state;
    const replyChecked = this.state.emailType === EMAIL_TYPE.reply;
    const replyAllChecked = this.state.emailType === EMAIL_TYPE.replyAll;
    const forwardChecked = this.state.emailType === EMAIL_TYPE.forward;

    // Get localized to/cc options from the address book.
    const options = transformAddressBook(this.props.addressBook);

    // Convert emailTo and emailCC from array of indexes to options.
    emailTo = optionsFromIds(this.props.addressBook, emailTo);
    emailCc = optionsFromIds(this.props.addressBook, emailCc);
    // These two constants are used by 2 seperate labels:
    // 1 is a popover (which does not exist until clicked on;
    // thus cannot be used for aria-labelled-by)
    // 2 is a visual hidden label which aria-labelled by can use
    const yourResponseTooltipText =
      LOCALIZE.emibTest.inboxPage.addEmailResponse.emailResponseTooltip;
    const reasonsTooltipText = LOCALIZE.emibTest.inboxPage.addEmailResponse.reasonsForActionTooltip;
    return (
      <div style={styles.container}>
        <form>
          <div>
            <fieldset>
              <legend className="font-weight-bold" style={styles.header.fieldsetLegend}>
                {LOCALIZE.emibTest.inboxPage.addEmailResponse.selectResponseType}
              </legend>
              <div style={styles.header.radioButtonZone} className="radio-button-hover">
                <input
                  id="reply-radio"
                  type="radio"
                  name="responseTypeRadio"
                  style={{ ...styles.header.radioPadding, ...styles.header.responseTypeRadio }}
                  onChange={this.onEmailTypeChange}
                  value={EMAIL_TYPE.reply}
                  checked={replyChecked}
                  className="visually-hidden"
                />
                <label
                  htmlFor="reply-radio"
                  style={
                    replyChecked
                      ? styles.header.radioTextSelected
                      : styles.header.radioTextUnselected
                  }
                >
                  <FontAwesomeIcon
                    icon={faReply}
                    style={{
                      ...styles.header.responseTypeIcons,
                      ...(replyChecked ? styles.header.responseTypeIconsSelected : {})
                    }}
                  />
                  {LOCALIZE.emibTest.inboxPage.emailCommons.reply}
                </label>
                <input
                  id="reply-all-radio"
                  type="radio"
                  name="responseTypeRadio"
                  style={{ ...styles.header.radioPadding, ...styles.header.responseTypeRadio }}
                  onChange={this.onEmailTypeChange}
                  value={EMAIL_TYPE.replyAll}
                  checked={replyAllChecked}
                  className="visually-hidden"
                />
                <label
                  htmlFor="reply-all-radio"
                  style={
                    replyAllChecked
                      ? styles.header.radioTextSelected
                      : styles.header.radioTextUnselected
                  }
                >
                  <FontAwesomeIcon
                    icon={faReplyAll}
                    style={{
                      ...styles.header.responseTypeIcons,
                      ...(replyAllChecked ? styles.header.responseTypeIconsSelected : {})
                    }}
                  />
                  {LOCALIZE.emibTest.inboxPage.emailCommons.replyAll}
                </label>
                <input
                  id="forward-radio"
                  type="radio"
                  name="responseTypeRadio"
                  style={{ ...styles.header.radioPadding, ...styles.header.responseTypeRadio }}
                  onChange={this.onEmailTypeChange}
                  value={EMAIL_TYPE.forward}
                  checked={forwardChecked}
                  className="visually-hidden"
                />
                <label
                  htmlFor="forward-radio"
                  style={
                    forwardChecked
                      ? styles.header.radioTextSelected
                      : styles.header.radioTextUnselected
                  }
                >
                  <FontAwesomeIcon
                    icon={faShareSquare}
                    style={{
                      ...styles.header.responseTypeIcons,
                      ...(forwardChecked ? styles.header.responseTypeIconsSelected : {})
                    }}
                  />
                  {LOCALIZE.emibTest.inboxPage.emailCommons.forward}
                </label>
              </div>
            </fieldset>
          </div>
          <div className="font-weight-bold" style={styles.header.toAndCcFieldPadding}>
            <label htmlFor="to-field" style={styles.header.titleStyle}>
              {LOCALIZE.emibTest.inboxPage.emailCommons.to}
            </label>
            <ReactSuperSelect
              placeholder="Select from address book"
              controlId="to-field"
              multiple={true}
              name="to"
              initialValue={emailTo}
              dataSource={options}
              onChange={this.onEmailToChange}
              keepOpenOnSelection={true}
              tags={true}
            />
          </div>
          <div className="font-weight-bold" style={styles.header.toAndCcFieldPadding}>
            <label htmlFor="cc-field" style={styles.header.titleStyle}>
              {LOCALIZE.emibTest.inboxPage.emailCommons.cc}
            </label>
            <ReactSuperSelect
              placeholder="Select from address book"
              controlId="cc-field"
              multiple={true}
              name="cc"
              initialValue={emailCc}
              dataSource={options}
              onChange={this.onEmailCcChange}
              keepOpenOnSelection={true}
              tags={true}
            />
          </div>
          <div>
            <div className="font-weight-bold form-group">
              <label id="your-response-text-label">
                {LOCALIZE.formatString(
                  LOCALIZE.emibTest.inboxPage.addEmailResponse.response,
                  MAX_RESPONSE
                )}
              </label>
              <OverlayTrigger
                trigger="focus"
                placement="right"
                overlay={
                  <Popover>
                    <div>
                      <p>{yourResponseTooltipText}</p>
                    </div>
                  </Popover>
                }
              >
                <Button
                  tabIndex="-1"
                  aria-label={LOCALIZE.ariaLabel.emailResponseTooltip}
                  style={styles.tooltipButton}
                  variant="link"
                >
                  ?
                </Button>
              </OverlayTrigger>
              <div>
                <label className="visually-hidden" id="your-response-tooltip-text">
                  {yourResponseTooltipText}
                </label>
                <textarea
                  id="your-response-text-area"
                  maxLength={MAX_RESPONSE}
                  aria-labelledby="your-response-text-label your-response-tooltip-text"
                  style={styles.response.textArea}
                  value={emailBody}
                  onChange={this.onEmailBodyChange}
                />
              </div>
              {this.state.emailBody.length >= MAX_RESPONSE && (
                <p className="visually-hidden" aria-live="assertive" role="alert">
                  {LOCALIZE.formatString(
                    LOCALIZE.emibTest.inboxPage.characterLimitReached,
                    MAX_RESPONSE
                  )}
                </p>
              )}
              <div style={styles.textCounter}>
                {this.state.emailBody === undefined ? 0 : this.state.emailBody.length}/
                {MAX_RESPONSE}
              </div>
            </div>
          </div>
          <div>
            <div className="font-weight-bold form-group">
              <label id="reasons-for-action-text-label">
                {LOCALIZE.formatString(
                  LOCALIZE.emibTest.inboxPage.addEmailResponse.reasonsForAction,
                  MAX_REASON
                )}
              </label>
              <OverlayTrigger
                trigger="focus"
                placement="right"
                overlay={
                  <Popover>
                    <div>
                      <p>{reasonsTooltipText}</p>
                    </div>
                  </Popover>
                }
              >
                <Button
                  tabIndex="-1"
                  aria-label={LOCALIZE.ariaLabel.reasonsForActionTooltip}
                  style={styles.tooltipButton}
                  variant="link"
                >
                  ?
                </Button>
              </OverlayTrigger>
              <div>
                <label className="visually-hidden" id="reasons-for-action-tooltip-text">
                  {reasonsTooltipText}
                </label>
                <textarea
                  id="reasons-for-action-text-area"
                  maxLength={MAX_REASON}
                  aria-labelledby="reasons-for-action-text-label reasons-for-action-tooltip-text"
                  style={styles.reasonsForAction.textArea}
                  value={reasonsForAction}
                  onChange={this.onReasonsForActionChange}
                />
              </div>
              {this.state.reasonsForAction.length >= MAX_REASON && (
                <p className="visually-hidden" aria-live="assertive" role="alert">
                  {LOCALIZE.formatString(
                    LOCALIZE.emibTest.inboxPage.characterLimitReached,
                    MAX_REASON
                  )}
                </p>
              )}
              <div style={styles.textCounter}>
                {this.state.reasonsForAction === undefined ? 0 : this.state.reasonsForAction.length}
                /{MAX_REASON}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export { EditEmail as UnconnectedEditEmail };

const mapStateToProps = (state, ownProps) => {
  return {
    addressBook: getAddressInCurrentLanguage(state)
  };
};

export default connect(
  mapStateToProps,
  null
)(EditEmail);
