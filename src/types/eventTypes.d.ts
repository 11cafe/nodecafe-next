// Define the detail type for the canvasHeightUpdated event
export type UpdateCanvasHeight = {
  type: "updateCanvasHeight";
  height: number;
};

export type OnClickNodeEvent = {
  type: "onClickNodeEvent";
  nodeType: string;
};
