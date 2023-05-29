import { NotificationInstance } from "antd/es/notification/interface";
import { Problem } from "colorblind/shared/lib/models/models";

export const defaultError = (api: NotificationInstance, problem: Problem) => {
  api.error({
    message: problem.title,
    description: problem.detail,
    placement: "bottomLeft",
    duration: 5,
  });
};
