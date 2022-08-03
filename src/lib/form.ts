import { goto, invalidate } from '$app/navigation';
import type { ZodError } from 'zod';

function isForm(element: HTMLElement): element is HTMLFormElement {
	return 'action' in element && 'method' in element && 'reset' in element && 'elements' in element;
}

type EnhanceOptions = {
	redirect?: boolean;
	confirm?: string;
	reset?: boolean;
	refocus?: boolean;
};
const defaultEnhanceOptions = { redirect: false, confirm: undefined, reset: true, refocus: true };
export function enhance(
	element: HTMLElement,
	{
		redirect = defaultEnhanceOptions.redirect,
		confirm = defaultEnhanceOptions.confirm,
		reset = defaultEnhanceOptions.reset,
		refocus = defaultEnhanceOptions.refocus,
	}: EnhanceOptions = defaultEnhanceOptions
) {
	if (!isForm(element)) return;

	const onSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (confirm && !window.confirm(confirm)) {
			return;
		}

		const action = element.action;

		const result = await fetch(action, {
			method: element.method,
			credentials: 'same-origin',
			body: new FormData(element),
		});

		if (result.status >= 400) {
			return;
		}

		if (result.status >= 300 && redirect && result.headers.has('location')) {
			goto(result.headers.get('location')!);
			return;
		}

		const invalidateURI = action.replace(/\?_method=(PUT|PATCH|DELETE)/g, '');
		await invalidate(invalidateURI);

		if (reset) {
			element.reset();
		}

		if (refocus) {
			for (const input of element.elements) {
				if (input.getAttribute('type') !== 'hidden') {
					(input as HTMLElement)?.focus();
					break;
				}
			}
		}
	};

	element.addEventListener('submit', onSubmit);

	return {
		update(props: EnhanceOptions) {
			redirect = props.redirect ?? defaultEnhanceOptions.redirect;
			confirm = props.confirm ?? defaultEnhanceOptions.confirm;
			reset = props.reset ?? defaultEnhanceOptions.reset;
			refocus = props.reset ?? defaultEnhanceOptions.refocus;
		},
		destroy() {
			element.removeEventListener('submit', onSubmit);
		},
	};
}

export function encodeErrors(path: string, zodError: ZodError) {
	if (!zodError || zodError.isEmpty) {
		return path;
	}

	const encodedError = JSON.stringify(zodError);
	const args = new URLSearchParams({ error: encodedError });
	return `${path}?${args}`;
}

export function decodeErrors(search: string) {
	const args = new URLSearchParams(search);

	if (!args.has('error')) {
		return;
	}

	let decodedError;
	try {
		decodedError = JSON.parse(args.get('error')!);
	} catch {
		return;
	}

	return decodedError as ZodError;
}
