import type { ParamMatcher } from '@sveltejs/kit';

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const match: ParamMatcher = (param) => {
	return uuidRegex.test(param);
};
