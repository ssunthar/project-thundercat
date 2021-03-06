import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";
import LOCALIZE from "../../text_resources";
import { actionShape } from "./constants";
import "../../css/inbox.css";

// These two consts limit the number of characters
// that can be entered into two text areas
// and are used to display <x>/<MAX>
// under the text areas
const MAX_TASK = "650";
const MAX_REASON = "650";

const styles = {
  header: {
    color: "#00565E",
    paddingTop: 12
  },
  textCounter: {
    width: "100%",
    textAlign: "right",
    paddingRight: 12
  },
  tasks: {
    title: {
      float: "left",
      marginRight: 6
    },
    icon: {
      color: "#00565E",
      marginTop: "4px",
      width: 15,
      cursor: "pointer"
    },
    textArea: {
      padding: "6px 12px",
      border: "1px solid #00565E",
      borderRadius: 4,
      width: "100%",
      height: 125,
      resize: "none"
    }
  },
  reasonsForAction: {
    title: {
      float: "left",
      marginRight: 6
    },
    icon: {
      color: "#00565E",
      marginTop: "4px",
      cursor: "pointer"
    },
    textArea: {
      padding: "6px 12px",
      border: "1px solid #00565E",
      borderRadius: 4,
      width: "100%",
      height: 100,
      resize: "none"
    }
  },
  tooltipButton: {
    float: "right",
    textDecoration: "underline"
  }
};

class EditTask extends Component {
  state = {
    task: !this.props.action ? "" : !this.props.action.task ? "" : this.props.action.task,
    reasonsForAction: !this.props.action
      ? ""
      : !this.props.action.reasonsForAction
      ? ""
      : this.props.action.reasonsForAction
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    action: actionShape
  };

  onTaskContentChange = event => {
    const newTaskContent = event.target.value;
    this.setState({ task: newTaskContent });
    this.props.onChange({ ...this.state, task: newTaskContent });
  };

  onReasonsForActionChange = event => {
    const newReasonForAction = event.target.value;
    this.setState({ reasonsForAction: newReasonForAction });
    this.props.onChange({ ...this.state, reasonsForAction: newReasonForAction });
  };

  render() {
    const { task, reasonsForAction } = this.state;
    // These two constants are used by 2 seperate labels:
    // 1 is a popover (which does not exist until clicked on;
    // thus cannot be used for aria-labelled-by)
    // 2 is a visual hidden label which aria-labelled by can use
    // Note: yourTaskTooltipText is not used for the popup label as it needs additional html
    const yourTaskTooltipText =
      LOCALIZE.emibTest.inboxPage.taskContent.taskTooltipPart1 +
      LOCALIZE.emibTest.inboxPage.taskContent.taskTooltipPart2;
    const reasonsTooltipText = LOCALIZE.emibTest.inboxPage.taskContent.reasonsForActionTooltip;

    return (
      <div style={styles.container}>
        <form>
          <div>
            <div className="font-weight-bold form-group">
              <label id="your-task-text-label" style={styles.tasks.title}>
                {LOCALIZE.formatString(LOCALIZE.emibTest.inboxPage.addEmailTask.task, MAX_TASK)}
              </label>
              <OverlayTrigger
                trigger="focus"
                placement="right"
                overlay={
                  <Popover>
                    <div>
                      <p>{LOCALIZE.emibTest.inboxPage.taskContent.taskTooltipPart1}</p>
                      <p>{LOCALIZE.emibTest.inboxPage.taskContent.taskTooltipPart2}</p>
                    </div>
                  </Popover>
                }
              >
                <Button
                  tabIndex="-1"
                  aria-label={LOCALIZE.ariaLabel.taskTooltip}
                  style={styles.tooltipButton}
                  variant="link"
                >
                  ?
                </Button>
              </OverlayTrigger>
              <div>
                <label className="visually-hidden" id="your-task-tooltip-text">
                  {yourTaskTooltipText}
                </label>
                <textarea
                  id="your-tasks-text-area"
                  maxLength={MAX_TASK}
                  aria-labelledby="your-task-text-label your-task-tooltip-text"
                  style={styles.tasks.textArea}
                  value={task}
                  onChange={this.onTaskContentChange}
                />
              </div>
              {this.state.task.length >= MAX_TASK && (
                <p className="visually-hidden" aria-live="assertive" role="alert">
                  {LOCALIZE.formatString(
                    LOCALIZE.emibTest.inboxPage.characterLimitReached,
                    MAX_TASK
                  )}
                </p>
              )}
              <div style={styles.textCounter} id="unit-test-task-response">
                {this.state.task === undefined ? 0 : this.state.task.length}/{MAX_TASK}
              </div>
            </div>
          </div>
          <div>
            <div className="font-weight-bold form-group">
              <label id="reasons-for-action-text-label" style={styles.reasonsForAction.title}>
                {LOCALIZE.formatString(
                  LOCALIZE.emibTest.inboxPage.addEmailTask.reasonsForAction,
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
              <div style={styles.textCounter} id="unit-test-task-rfa">
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
export default EditTask;
