'use client'

import { Text } from '@/components/ui/text-client'
import { downloadFile } from '@/helpers/file'
import { FileText, Image } from 'lucide-react'
import { toast } from 'sonner';

export function ResumeDownloadButtons() {
  const handlePdfDownload = () => {
    downloadFile('/media/resume/resume.pdf', 'resume.pdf');
    toast('PDF резюме скачено');
  }

  const handleImageDownload = () => {
    downloadFile('/media/resume/resume.jpg', 'resume.jpg');
     toast('JPG резюме скачено');
  }
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground border-b-2 border-border pb-2">
        <Text text="page.resume.download.title" />
      </h2>
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handlePdfDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <Text text="page.resume.download.pdf" />
          </button>
          <button
            onClick={handleImageDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
          >
            <Image className="h-5 w-5" />
            <Text text="page.resume.download.image" />
          </button>
        </div>
      </div>
    </div>
  )
}
