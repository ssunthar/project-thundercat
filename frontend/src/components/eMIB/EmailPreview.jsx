import React, { Component } from "react";
import PropTypes from "prop-types";
import LOCALIZE from "../../text_resources";

const styles = {
  //buttons
  button: {
    width: 155,
    textAlign: "left",
    borderRadius: 4,
    padding: 6,
    border: "2px solid #00565E",
    cursor: "pointer"
  },
  buttonSelectedBackground: {
    backgroundColor: "#00565E"
  },
  buttonReadBackground: {
    backgroundColor: "#F5F5F5"
  },
  buttonUnreadBackground: {
    backgroundColor: "white"
  },
  buttonSelectedText: {
    color: "#D3FCFF"
  },
  buttonUnselectedText: {
    color: "black"
  },
  //li
  li: {
    listStyleType: "none"
  },
  //subject line
  subjectSelected: {
    color: "white"
  },
  subjectUnselected: {
    color: "#00565E"
  },
  subjectRead: {
    fontWeight: "normal"
  },
  subjectUnread: {
    fontWeight: "bold"
  },
  truncated: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};

class EmailPreview extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired,
    selectEmail: PropTypes.func.isRequired,
    isRead: PropTypes.bool.isRequired,
    isRepliedTo: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired
  };

  // if there is a "(" in the From field of the preview, remove it and return the remainder
  // When there is a database, the () portion of the To/From may be populated by a seperate field
  // but this will remove it until the design is finalized
  trimFromName(string) {
    let index = string.indexOf("(");
    if (index === -1) {
      return string;
    }
    return string.slice(0, index);
  }

  render() {
    //READ/UNREAD CHECK
    //defaults, or if unread
    let buttonBackgroundColor = styles.buttonUnreadBackground;
    let subjectIsRead = styles.subjectUnread;
    if (this.props.isRead) {
      //if it is read
      buttonBackgroundColor = styles.buttonReadBackground;
      subjectIsRead = styles.subjectRead;
    }

    //SELECTED/UNSELECTED CHECK
    //defaults, or unselected
    let buttonTextColor = styles.buttonUnselectedText;
    let subjectIsSelected = styles.subjectUnselected;
    if (this.props.isSelected) {
      //if it is selected
      buttonBackgroundColor = styles.buttonSelectedBackground;
      buttonTextColor = styles.buttonSelectedText;
      subjectIsSelected = styles.subjectSelected;
    }

    let buttonStyle = { ...styles.button, ...buttonTextColor, ...buttonBackgroundColor };
    let subject = { ...subjectIsRead, ...subjectIsSelected, ...styles.truncated };
    const email = this.props.email;
    return (
      <li
        id={
          this.props.isSelected
            ? "unit-test-selected-email-preview"
            : "unit-test-unselected-email-preview"
        }
        style={styles.li}
        aria-current={this.props.isSelected ? "page" : ""}
        role="menuitem"
      >
        <div style={buttonStyle} onClick={() => this.props.selectEmail(email.id)}>
          <div id={this.props.isRead ? "read-email-preview" : "unread-email-preview"}>
            {this.props.isRead ? (
              <i className="far fa-envelope-open" />
            ) : (
              <i className="fas fa-envelope" />
            )}
            {LOCALIZE.emibTest.inboxPage.emailId}
            {email.visibleID}&emsp;
            {this.props.isRepliedTo && <i className="fas fa-sign-out-alt" />}
          </div>
          <div style={subject}>{email.subject}</div>
          <div style={styles.truncated}>{this.trimFromName(email.from)}</div>
        </div>
      </li>
    );
  }
}

export default EmailPreview;