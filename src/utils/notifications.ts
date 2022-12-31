import { notification } from "antd";
import { CSSProperties } from "react";

const styleOverrides: CSSProperties = {
  backgroundColor: "#eee",
  color: "black !important",
  fontWeight: "700",
};

const duration = 3;

export const infoNotif = (message: string, description: string) => {
  notification.info({
    message,
    description,
    placement: "bottomLeft",
    style: styleOverrides,
    duration,
  });
};

export const successNotif = (message: string, description: string) => {
  notification.success({
    message,
    description,
    placement: "bottomLeft",
    style: styleOverrides,
    duration,
  });
};

export const errorNotif = (message: string, description: string) => {
  notification.error({
    message,
    description,
    placement: "bottomLeft",
    style: styleOverrides,
    duration,
  });
};
