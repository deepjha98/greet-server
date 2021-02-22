import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import classnames from "classnames";
import clipboardCopy from "clipboard-copy";
import * as appPropTypes from "./appPropTypes";
import { withRoomContext } from "../RoomContext";
import * as requestActions from "../redux/requestActions";
import { Appear } from "./transitions";
import Me from "./Me";
import ChatInput from "./ChatInput";
import Peers from "./Peers";
// import Stats from './Stats';
import Notifications from "./Notifications";
import NetworkThrottle from "./NetworkThrottle";
import videoAction from "../utils/actionCall";
import Popup from "reactjs-popup";
import axios from "axios";
import swal from "sweetalert";

class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      name: "",
      popup: true,
      token: localStorage.getItem("auth-token") || false,
      emailError: false,
      error: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    if (this.state.email && this.state.name) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
        console.log("Enter Valid Email");
        this.setState({ emailError: true });
        setTimeout(() => this.setState({ emailError: false }), 3000);
      } else {
        try {
          const { data } = await axios.get(
            `https://precisely.one/api/v1/verify_email_registration_to_event?room_id=${localStorage.getItem(
              "roomId"
            )}&name=${this.state.name}&email=${this.state.email}`
          );
          console.log(data);
          try {
            const { data } = await axios.post(
              "https://precisely.one/api/v1/register_new_user_to_event",
              {
                email: this.state.email,
                name: this.state.name,
                room_id: localStorage.getItem("roomId"),
              }
            );
            // console.log(data);
            console.log(data.data);
            localStorage.setItem("auth-token", data.data.access_token);
            videoAction("connected", true);
            this.setState({ popup: false });
            swal("Register Success", "", "success");
          } catch (error) {
            swal("Unable to register", "", "error");
            console.log("error", error.response);
          }
        } catch (error) {
          swal(
            "Forbidden",
            "Please enter a valid email, this email is not assigned with this event, contact manager",
            "error"
          );
          console.log("-------------------------------------------");
          console.log(error.response.data);
        }
        console.log("Email", this.state.email);
        console.log("Name", this.state.name);
      }
    } else {
      console.log("Enter Name and Email");
      this.setState({ error: true });
      setTimeout(() => this.setState({ error: false }), 3000);
    }
  }

  render() {
    const {
      roomClient,
      room,
      me,
      amActiveSpeaker,
      onRoomLinkCopy,
    } = this.props;

    return (
      <Fragment>
        {this.state.popup && !this.state.token && (
          <Popup open={true} disabled={true}>
            <div className="popup-modal">
              <form onSubmit={this.handleSubmit}>
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="email">Enter Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                    <small
                      style={{
                        color: "#555555",
                        fontSize: "0.8rem",
                        marginTop: "5px",
                      }}
                    >
                      Please use the exact same email address given by Precisely
                    </small>
                    {this.state.emailError && (
                      <small
                        style={{
                          color: "red",
                          fontSize: "0.8rem",
                          marginTop: "5px",
                        }}
                      >
                        Enter Valid Email
                      </small>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Enter Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={this.state.name}
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  </div>
                  <input type="submit" className="submit-btn" />
                </div>
                {this.state.error && (
                  <small style={{ color: "red", fontSize: "0.8rem" }}>
                    Enter Email and Name
                  </small>
                )}
              </form>
            </div>
          </Popup>
        )}
        <Appear duration={300}>
          <div data-component="Room">
            <Notifications />

            <div className="heading-name">
              <p>Greet</p>
            </div>

            <div className="state">
              <div className={classnames("icon", room.state)} />
              <p className={classnames("text", room.state)}>{room.state}</p>
            </div>

            <div className="room-link-wrapper">
              <div className="room-link">
                <a
                  className="link"
                  href={room.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    // If this is a 'Open in new window/tab' don't prevent
                    // click default action.
                    if (
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.metaKey ||
                      // Middle click (IE > 9 and everyone else).
                      (event.button && event.button === 1)
                    ) {
                      return;
                    }

                    event.preventDefault();

                    clipboardCopy(room.url).then(onRoomLinkCopy);
                  }}
                >
                  copy invitation link
                </a>
              </div>
            </div>

            <div className="room-close-wrapper">
              <div className="room-close-button">
                <a
                  className="close-button"
                  onClick={(event) => {
                    videoAction("connected", 0);
                    localStorage.removeItem("auth-token");
                    localStorage.removeItem("roomId");
                    roomClient.close();
                    var strWindowFeatures =
                      "location=yes,height=570,width=520,scrollbars=yes,status=yes";
                    var URL = "https://app.precisely.one";
                    var win = window.open(URL, "_self", strWindowFeatures);
                  }}
                >
                  <svg className="close-svg">
                    <rect
                      className="close-rect"
                      x="0"
                      y="0"
                      rx="25"
                      fill="none"
                      width="100%"
                      height="100%"
                    />
                  </svg>
                  End Call
                </a>
              </div>
            </div>
            <Peers />

            <div
              className={classnames("me-container", {
                "active-speaker": amActiveSpeaker,
              })}
            >
              {/* MAIN VIDEO CONTAINER */}
              <Me />
            </div>

            <div className="chat-input-container">
              <ChatInput />
            </div>

            <div className="sidebar">
              <div
                className={classnames("button", "hide-videos", {
                  on: me.audioOnly,
                  disabled: me.audioOnlyInProgress,
                })}
                data-tip={"Show/hide participants' video"}
                onClick={() => {
                  me.audioOnly
                    ? roomClient.disableAudioOnly()
                    : roomClient.enableAudioOnly();
                }}
              />

              <div
                className={classnames("button", "mute-audio", {
                  on: me.audioMuted,
                })}
                data-tip={"Mute/unmute participants' audio"}
                onClick={() => {
                  me.audioMuted
                    ? roomClient.unmuteAudio()
                    : roomClient.muteAudio();
                }}
              />

              <div
                className={classnames("button", "restart-ice", {
                  disabled: me.restartIceInProgress,
                })}
                data-tip="Restart ICE"
                onClick={() => roomClient.restartIce()}
              />
            </div>

            {/* <Stats /> */}

            <If condition={window.NETWORK_THROTTLE_SECRET}>
              <NetworkThrottle secret={window.NETWORK_THROTTLE_SECRET} />
            </If>

            <ReactTooltip
              type="light"
              effect="solid"
              delayShow={100}
              delayHide={100}
              delayUpdate={50}
            />
          </div>
        </Appear>
      </Fragment>
    );
  }

  componentDidMount() {
    const { roomClient } = this.props;

    roomClient.join();
  }
}

Room.propTypes = {
  roomClient: PropTypes.any.isRequired,
  room: appPropTypes.Room.isRequired,
  me: appPropTypes.Me.isRequired,
  amActiveSpeaker: PropTypes.bool.isRequired,
  onRoomLinkCopy: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    room: state.room,
    me: state.me,
    amActiveSpeaker: state.me.id === state.room.activeSpeakerId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRoomLinkCopy: () => {
      dispatch(
        requestActions.notify({
          text: "Room link copied to the clipboard",
        })
      );
    },
  };
};

const RoomContainer = withRoomContext(
  connect(mapStateToProps, mapDispatchToProps)(Room)
);

export default RoomContainer;
