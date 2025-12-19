
export interface TranscriptionResult {
  title: string;
  summary: string;
  fullTranscription: string;
  keyTopics: string[];
  actionItems: string[];
  language: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface FileData {
  file: File;
  preview: string;
  base64: string;
}
