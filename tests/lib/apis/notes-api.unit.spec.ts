import { CreateNoteDto, FindNotesDto, Note } from "src/lib/types/notes.model";
import fetchMock from "mocks/fetch";
import {
  NOTES_API_URL,
  fetchCreateNote,
  fetchFindNotes,
  fetchFindOneNote,
} from "src/lib/apis/notes-api";
import { CustomError } from "src/lib/utils/CustomError";

describe("Test Note API", () => {
  describe("Test Create Note", () => {
    beforeAll(() => {
      global.fetch = fetchMock;
    });

    it("Should return data if fetch is successful 1/2", async () => {
      const noteMock = { data: { note_id: "123", title: "Hello World" } };
      const createNoteRes = [noteMock.data, null];

      fetchMock.mockResolvedValueOnce({
        status: 201,
        json: jest.fn().mockResolvedValueOnce(noteMock),
      });

      const dto: CreateNoteDto = {
        title: "Hello World",
        content: "Lorem ipsum",
        reference_url: "",
        categories: [],
      };

      const res = await fetchCreateNote(dto, "");

      expect(res).toEqual(createNoteRes);
    });

    it("Should return data if fetch is successful 2/2", async () => {
      const noteMock = { data: { note_id: "456", title: "Docker Cheatsheet" } };
      const createNoteRes = [noteMock.data, null];

      fetchMock.mockResolvedValueOnce({
        status: 201,
        json: jest.fn().mockResolvedValueOnce(noteMock),
      });

      const dto: CreateNoteDto = {
        title: "Docker Cheatsheet",
        content: "docker is a ...",
        reference_url: "",
        categories: [],
      };

      const res = await fetchCreateNote(dto, "");

      expect(res).toEqual(createNoteRes);
    });

    it("Should return null data and error if response status is not 201", async () => {
      const error = new CustomError(500, ["Internal server error."]);
      const createNoteRes = [null, error];

      fetchMock.mockResolvedValueOnce({
        status: 500,
        json: jest.fn().mockResolvedValueOnce({
          data: null,
          errors: ["Internal server error."],
        }),
      });

      const dto: CreateNoteDto = {
        title: "Activity logs",
        content: "# 28-04-23  \n1.Today i did nothing meaningful...",
        reference_url: "",
        categories: [],
      };

      const res = await fetchCreateNote(dto, "");

      expect(res[0]).toBeNull();
      expect(res).toEqual(createNoteRes);
    });

    it("Should return null data and error if fetch is unsuccessful", async () => {
      const error = new CustomError(500, ["Internal server error."]);
      const createNoteRes = [null, error];

      fetchMock.mockResolvedValueOnce({
        status: 500,
        json: jest.fn().mockResolvedValueOnce({
          data: null,
          errors: ["Internal server error."],
        }),
      });

      const dto: CreateNoteDto = {
        title: "Activity logs",
        content: "# 28-04-23  \n1.Today i did nothing meaningful...",
        reference_url: "",
        categories: [],
      };

      const res = await fetchCreateNote(dto, "");

      expect(res[0]).toBeNull();
      expect(res).toEqual(createNoteRes);
    });
  });

  describe("Test Find One Note", () => {
    const noteMock: Note = {
      note_id: "890",
      title: "Activity Logs",
      content: "# 28-04-23  \n1.Today i did nothing meaningful...",
      categories: [],
      created_at: new Date(),
      updated_at: new Date(),
    };

    beforeAll(() => {
      global.fetch = fetchMock;
    });

    it("Should successfully return note specified by note_id 1/2", async () => {
      const currentNoteMock = { ...noteMock, note_id: "456" };

      fetchMock.mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          data: currentNoteMock,
          errors: [],
        }),
      });

      const resMock = [currentNoteMock, null];

      const res = await fetchFindOneNote("456", "");

      expect(res[1]).toBeNull();
      expect(res[0]).toBeDefined();
      expect(res[0]?.note_id).toEqual(currentNoteMock.note_id);
      expect(res).toEqual(resMock);
    });

    it("Should successfully return note specified by note_id 2/2", async () => {
      const currentNoteMock = { ...noteMock };

      fetchMock.mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce({
          data: currentNoteMock,
          errors: [],
        }),
      });

      const resMock = [currentNoteMock, null];

      const res = await fetchFindOneNote("890", "");

      expect(res[1]).toBeNull();
      expect(res[0]).toBeDefined();
      expect(res[0]?.note_id).toEqual(currentNoteMock.note_id);
      expect(res).toEqual(resMock);
    });

    it("Should return null data and error if fetch is unsuccessful 1/2", async () => {
      const fetchResMock = {
        status: 500,
        json: jest.fn().mockResolvedValueOnce({
          data: null,
          errors: ["Internal server error."],
        }),
      };

      fetchMock.mockResolvedValueOnce(fetchResMock);

      const res = await fetchFindOneNote("123", "");

      expect(res[0]).toBeNull();
      expect(res[1]).toBeInstanceOf(Error);
      expect(res[1]?.errors[0]).toEqual("Internal server error.");
    });

    it("Should return null data and error if fetch is unsuccessful 2/2", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Internal server error."));

      const res = await fetchFindOneNote("123", "");

      expect(res[0]).toBeNull();
      expect(res[1]).toBeInstanceOf(Error);
      expect(res[1]?.message).toEqual("Internal server error.");
    });
  });
});
