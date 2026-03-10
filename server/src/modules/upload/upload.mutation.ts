import { builder } from "../../builder";
import { saveFile } from "../../utils/file";

builder.mutationFields((t) => ({
	uploadImage: t.field({
		type: "String",
		args: {
			file: t.arg({ type: "File", required: true }),
		},
		resolve: async (_root, { file }) => {
			const url = await saveFile(file as unknown as File);
			return url;
		},
	}),
}));
