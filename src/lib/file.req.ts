/**
 * File request API
 */
import { default as axios } from "axios";

import { config } from "../config";

class FileAPIRequest {
	public static upload = (file: File) => {
		const data = new FormData();
		data.append("file", file);
		return axios(`${config.baseurl}/api/v1/file/upload`, {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
			},
			data,
			withCredentials: true,
		});
	}
}

export default FileAPIRequest;
