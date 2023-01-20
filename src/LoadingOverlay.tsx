import React from "react";
//@ts-ignore
import loadingLogo from "./images/loading.svg";

export default function LoadingOverlay(props: { successTxn: boolean }) {
  return (
    <div className="loadingOverlay">
      <img src={loadingLogo} style={{ width: "50px" }} />
      <h1>
        {!props.successTxn && "Processing..."}
        {props.successTxn && "Success!"}
      </h1>
    </div>
  );
}
