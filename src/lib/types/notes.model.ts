import { PaginationDto } from "src/lib/types/pagination.model";

export interface Note {
  note_id: string;
  title: string;
  content: string;
  categories: string[];
  created_at: Date | string;
  updated_at: Date | string;
}

export interface FindNotesDto extends PaginationDto {
  title?: string;
  content?: string;
  categories?: number[];
}

export interface SearchNotesDto extends PaginationDto {
  keyword: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  categories: string[];
  reference_url: string;
}
