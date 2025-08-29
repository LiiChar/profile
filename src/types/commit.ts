export type Commit = {
	sha: string;
	html_url: string;
	commit: {
		message: string;
		author: { name: string; date: string };
	};
	parents: { sha: string }[];
};
