"use client";

import React, { useRef, useEffect } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { cn } from '@/lib/utils';
import { materialDark } from '@uiw/codemirror-theme-material';

interface CustomScriptEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomScriptEditor({
  value,
  onValueChange,
  placeholder,
  className,
}: CustomScriptEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const state = EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          javascript(),
          materialDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onValueChange(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });
      viewRef.current = view;
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [onValueChange]); // Run only on mount and unmount

  // Update editor content if the value prop changes from outside
  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: value },
      });
    }
  }, [value]);


  return (
    <div
      ref={editorRef}
      className={cn(
        "relative w-full rounded-md border border-input bg-background font-code text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 min-h-[240px] overflow-hidden",
        className
      )}
    />
  );
}
