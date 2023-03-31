import { fetchCreateNote } from "src/lib/apis/notes-api";
import { CreateNoteDto } from "src/lib/types/notes.model";
import fetchMock from "src/../__mocks__/fetch";

jest.mock("global", () => ({ fetch: fetchMock }));

describe("Test Note API", () => {
  const noteMock = { data: { note_id: "123", title: "Hello World" } };

  describe("Test Create Note", () => {
    const createNoteMock: CreateNoteDto = {
      title: "Test",
      content: "New Note",
      categories: [],
      reference_url: "",
    };

    it("Should return data if fetch is successful 1/2", async () => {
      fetchMock.mockResolvedValueOnce({
        status: 200,
        json: jest.fn().mockResolvedValueOnce(noteMock),
      });

      const res = await fetchCreateNote(createNoteMock, "");

      expect(res).toEqual(noteMock);
    });

    it("Should return data if fetch is successful 2/2", async () => {
      fetchMock.mockResolvedValueOnce({
        status: 201,
        json: jest.fn().mockResolvedValueOnce({ ...noteMock, title: "Docker Cheatsheet" }),
      });

      const dto = {
        ...createNoteMock,
        title: "Docker Cheatsheet",
      };

      const res = await fetchCreateNote(dto, "");

      expect(res).toEqual(noteMock);
    });
  });
});
