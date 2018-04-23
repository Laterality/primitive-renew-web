import * as jquery from "jquery";

export const onComponentReady = () => {
	($("body") as any)["bootstrapMaterialDesign"]();
};
