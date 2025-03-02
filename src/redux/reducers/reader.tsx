import OtherUtil from "../../utils/otherUtil";
const initState = {
  bookmarks: null,
  notes: [],
  digests: [],
  locations: null,
  chapters: null,
  flattenChapters: null,
  color: 0,
  noteKey: "",
  originalText: "",
  isSingle: OtherUtil.getReaderConfig("isSingle") || "double",
};
export function reader(
  state = initState,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case "HANDLE_BOOKMARKS":
      return {
        ...state,
        bookmarks: action.payload,
      };
    case "HANDLE_NOTES":
      return {
        ...state,
        notes: action.payload,
      };
    case "HANDLE_ORIGINAL_TEXT":
      return {
        ...state,
        originalText: action.payload,
      };
    case "HANDLE_COLOR":
      return {
        ...state,
        color: action.payload,
      };
    case "HANDLE_NOTE_KEY":
      return {
        ...state,
        noteKey: action.payload,
      };
    case "HANDLE_DIGESTS":
      return {
        ...state,
        digests: action.payload,
      };
    case "HANDLE_LOCATIONS":
      return {
        ...state,
        locations: action.payload,
      };
    case "HANDLE_SECTION":
      return {
        ...state,
        section: action.payload,
      };
    case "HANDLE_SINGLE":
      return {
        ...state,
        isSingle: action.payload,
      };
    case "HANDLE_CHAPTERS":
      return {
        ...state,
        chapters: action.payload,
      };
    case "HANDLE_FLATTEN_CHAPTERS":
      return {
        ...state,
        flattenChapters: action.payload,
      };
    default:
      return state;
  }
}
