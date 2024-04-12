import {
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  headingsPlugin,
  InsertTable,
  listsPlugin,
  linkDialogPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  MDXEditor,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import clsx from "clsx";
import "@mdxeditor/editor/style.css";
import { useColorMode } from "@chakra-ui/react";
import { forwardRef } from "react";
import styles from "./MarkdownEditor.module.css";

export type { MDXEditorMethods } from "@mdxeditor/editor";

export const MarkdownEditor = forwardRef<
  MDXEditorMethods,
  { markdown?: string }
>(function MarkdownEditor({ markdown = "" }, ref) {
  const { colorMode } = useColorMode();
  return (
    <MDXEditor
      className={clsx(
        colorMode === "dark" && clsx(styles.mdxEditorDark, "dark-theme"),
      )}
      contentEditableClassName="mdx-editor"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkDialogPlugin(),
        thematicBreakPlugin(),
        tablePlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertTable />
            </>
          ),
        }),
      ]}
      ref={ref}
      markdown={markdown}
      placeholder="Add a comment..."
    />
  );
});
