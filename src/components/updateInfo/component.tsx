//左下角的图标外链
import React from "react";
import "./updateInfo.css";
import { UpdateInfoProps, UpdateInfoState } from "./interface";
import { updateLog } from "../../utils/readerConfig";
import { Trans } from "react-i18next";

import axios from "axios";

class UpdateInfo extends React.Component<UpdateInfoProps, UpdateInfoState> {
  constructor(props: UpdateInfoProps) {
    super(props);
    this.state = { downlownLink: "" };
  }
  componentDidMount() {
    axios
      .get("https://koodo.960960.xyz/update")
      .then((res) => {
        console.log(res);
        const download = res.data.download;
        const version = res.data.log.version;
        // console.log(version, "version");
        if (this.compareVersion(updateLog.version, version)) {
          navigator.platform === "Win32"
            ? this.setState({ downlownLink: download[0].url })
            : this.setState({ downlownLink: download[1].url });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  compareVersion = (ver1: string, ver2: string) => {
    const ver1Arr = ver1.split(".");
    const ver2Arr = ver2.split(".");

    for (let i = 0; i < ver1Arr.length; i++) {
      if (parseInt(ver1Arr[i]) < parseInt(ver2Arr[i])) {
        return true;
      }
    }
    return false;
  };
  render() {
    return (
      <a
        href={this.state.downlownLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className="update-info-container"
          style={this.state.downlownLink ? {} : { display: "none" }}
        >
          <Trans>New Version Available</Trans>
        </div>
      </a>
    );
  }
}

export default UpdateInfo;
