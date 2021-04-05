

/* Check HTTP status if its ok */
export function checkHttpStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		throw response;
	}
}

/* To parse response to JSON object */
export function parseJSON(response) {
	return response.json();
}

 