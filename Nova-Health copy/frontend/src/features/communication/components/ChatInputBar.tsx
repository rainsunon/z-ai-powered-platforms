import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

export function ChatInputBar() {
  return (
    <div className="p-6 bg-white/50 backdrop-blur-xl border-t border-surface-variant/10">
      <div className="flex items-end gap-4 max-w-5xl mx-auto">
        <TooltipProvider>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" className="rounded-full hover:bg-surface-container-high text-primary" />}
              >
                <span className="material-symbols-outlined" data-icon="add">add</span>
              </TooltipTrigger>
              <TooltipContent>Upload File</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" className="rounded-full hover:bg-surface-container-high text-stone-500" />}
              >
                <span className="material-symbols-outlined" data-icon="attach_file">attach_file</span>
              </TooltipTrigger>
              <TooltipContent>Attach Document</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={<Button variant="ghost" size="icon" className="rounded-full hover:bg-surface-container-high text-stone-500" />}
              >
                <span className="material-symbols-outlined" data-icon="image">image</span>
              </TooltipTrigger>
              <TooltipContent>Add Image</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <div className="flex-1 relative group">
          <Textarea
            className="w-full min-h-0 bg-surface-container-low border-none rounded-[2rem] py-3.5 px-6 pr-12 text-sm focus:ring-4 focus:ring-primary/10 placeholder:text-stone-400 resize-none overflow-hidden transition-all shadow-inner"
            placeholder="Type your health update or question..."
            rows={1}
          />
          <button className="absolute right-2 bottom-2 p-2 rounded-full hover:bg-surface-container-highest text-stone-400 transition-colors">
            <span className="material-symbols-outlined" data-icon="sentiment_satisfied">sentiment_satisfied</span>
          </button>
        </div>
        <Button className="bg-primary text-white p-3.5 h-auto rounded-full shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-transform bg-gradient-to-br from-primary to-primary-container">
          <span className="material-symbols-outlined" data-icon="send" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
        </Button>
      </div>
      <p className="text-[10px] text-center text-stone-400 mt-4 font-medium uppercase tracking-widest">In case of medical emergency, please call 911 directly.</p>
    </div>
  );
}
