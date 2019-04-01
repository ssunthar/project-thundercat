import React, { Component } from "react";
import PropTypes from "prop-types";
import LOCALIZE from "../../text_resources";
import "../../css/inbox.css";

const styles = {
  header: {
    marginBottom: 35
  },
  emailId: {
    float: "left",
    marginRight: 12
  },
  replyStatus: {
    float: "right"
  },
  email: {
    textAlign: "left",
    padding: 24
  },
  replyAndUser: {
    color: "#00565E"
  },
  hr: {
    width: "100%",
    borderTop: "2px solid #00565E",
    margin: "24px 0 24px 0"
  }
};

class Email extends Component {
  static propTypes = {
    email: PropTypes.object.isRequired,
    respondToEmail: PropTypes.func.isRequired,
    isRepliedTo: PropTypes.bool.isRequired
  };

  replyToEmail = () => {
    this.props.respondToEmail(this.props.email.id);
  };

  addTaskToEmail = () => {
    this.props.respondToEmail(this.props.email.id);
  };

  render() {
    const email = this.props.email;

    return (
      <div style={styles.email}>
        <div style={styles.header}>
          <h5 style={styles.emailId}>
            {LOCALIZE.emibTest.inboxPage.emailId.toUpperCase()}
            {email.visibleID}
          </h5>
          {this.props.isRepliedTo && (
            <div className="font-weight-bold" style={styles.replyStatus}>
              <i className="fas fa-sign-out-alt" style={styles.replyAndUser} />
              {LOCALIZE.emibTest.inboxPage.replyTextPart1}0
              {LOCALIZE.emibTest.inboxPage.replyTextPart2}0
              {LOCALIZE.emibTest.inboxPage.replyTextPart3}
            </div>
          )}
        </div>
        <div>
          <button
            id="unit-test-email-reply-button"
            type="button"
            className="btn btn-primary"
            onClick={this.replyToEmail}
          >
            <i className="fas fa-envelope" />
            &emsp;
            {LOCALIZE.emibTest.inboxPage.addReply}
          </button>
          &emsp;
          <button
            id="unit-test-email-task-button"
            type="button"
            className="btn btn-primary"
            onClick={this.addTaskToEmail}
          >
            <i className="fas fa-tasks" />
            &emsp;
            {LOCALIZE.emibTest.inboxPage.addTask}
          </button>
        </div>
        <hr style={styles.hr} />
        <h3>{email.subject}</h3>
        <div>
          {LOCALIZE.emibTest.inboxPage.from}: <span style={styles.replyAndUser}>{email.from}</span>
        </div>
        <div>
          {LOCALIZE.emibTest.inboxPage.to}: <span style={styles.replyAndUser}>{email.to}</span>
        </div>
        <div>
          {LOCALIZE.emibTest.inboxPage.date}: {email.date}
        </div>
        <hr style={styles.hr} />
        <div>{email.body}</div>
      </div>
    );
  }
}
export default Email;