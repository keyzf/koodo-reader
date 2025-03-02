import { connect } from "react-redux";
import { stateType } from "../../redux/store";
import ViewArea from "./component";
import { handleFetchLocations } from "../../redux/actions/progressPanel";
import { handlePercentage } from "../../redux/actions/progressPanel";
import {
  handleOpenMenu,
  handleShowBookmark,
} from "../../redux/actions/viewArea";
import { handleReadingEpub } from "../../redux/actions/book";
import { withNamespaces } from "react-i18next";

const mapStateToProps = (state: stateType) => {
  return {
    chapters: state.reader.chapters,
    currentEpub: state.book.currentEpub,
    currentBook: state.book.currentBook,
    locations: state.progressPanel.locations,
    bookmarks: state.reader.bookmarks,
    isShowBookmark: state.viewArea.isShowBookmark,
  };
};
const actionCreator = {
  handleFetchLocations,
  handlePercentage,
  handleOpenMenu,
  handleShowBookmark,
  handleReadingEpub,
};

export default connect(
  mapStateToProps,
  actionCreator
)(withNamespaces()(ViewArea as any));
