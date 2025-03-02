//图书导航栏
import React from "react";
import "./navigationPanel.css";
import ContentList from "../../components/contentList";
import BookmarkList from "../../components/bookmarkList";
import ReadingTime from "../../utils/readingTime";
import { Trans } from "react-i18next";
import { NavigationPanelProps, NavigationPanelState } from "./interface";
import SearchBox from "../../components/searchBox";
import Parser from "html-react-parser";

class NavigationPanel extends React.Component<
  NavigationPanelProps,
  NavigationPanelState
> {
  timer: any;
  constructor(props: NavigationPanelProps) {
    super(props);
    this.state = {
      isContentShow: true,
      chapters: [],
      cover: "",
      time: ReadingTime.getTime(this.props.currentBook.key),
      isSearch: false,
      searchList: null,
      startIndex: 0,
      currentIndex: 0,
    };
    this.timer = null;
  }
  handleSearchState = (isSearch: boolean) => {
    this.setState({ isSearch });
  };
  handleSearchList = (searchList: any) => {
    this.setState({ searchList });
  };
  componentDidMount() {
    this.timer = setInterval(() => {
      let time = this.state.time;
      time += 1;
      this.setState({ time });
    }, 1000);
    this.props.currentEpub
      .coverUrl()
      .then((url: string) => {
        this.setState({ cover: url });
      })
      .catch(() => {
        console.log("Error occurs");
      });
    this.props.handleFetchBookmarks();
  }
  componentWillUnmount() {
    clearInterval(this.timer);
    ReadingTime.setTime(this.props.currentBook.key, this.state.time);
  }

  handleClick = (isContentShow: boolean) => {
    this.setState({ isContentShow });
  };
  renderSearchList = () => {
    if (!this.state.searchList[0]) {
      return (
        <div className="navigation-panel-empty-bookmark">
          <Trans>Empty</Trans>
        </div>
      );
    }
    return this.state.searchList
      .slice(
        this.state.currentIndex * 10,
        this.state.currentIndex * 10 + 10 > this.state.searchList.length
          ? this.state.searchList.length
          : this.state.currentIndex * 10 + 10
      )
      .map((item: any, index: number) => {
        return (
          <li
            className="nav-search-list-item"
            key={item.cfi}
            onClick={() => {
              this.props.currentEpub.rendition.display(item.cfi);
            }}
          >
            {Parser(item.excerpt)}
          </li>
        );
      });
  };
  renderSearchPage = () => {
    let startIndex = this.state.startIndex;
    let currentIndex =
      startIndex > 0 ? startIndex + 2 : this.state.currentIndex;
    let pageList = [];
    let total = Math.ceil(this.state.searchList.length / 10);
    if (total <= 5) {
      for (let i = 0; i < total; i++) {
        pageList.push(
          <li
            className={
              currentIndex === i
                ? "nav-search-page-item active-page "
                : "nav-search-page-item"
            }
            onClick={() => {
              this.setState({ currentIndex: i });
            }}
          >
            {i + 1}
          </li>
        );
      }
    } else {
      for (let i = 0; i < 5; i++) {
        let isShow = currentIndex > 2 ? i === 2 : currentIndex === i;
        pageList.push(
          <li
            className={
              isShow
                ? "nav-search-page-item active-page "
                : "nav-search-page-item"
            }
            onClick={() => {
              if (i === 3 && startIndex === 0) {
                this.setState({
                  startIndex: 1,
                  currentIndex: 3,
                });
                return;
              }
              this.setState({
                startIndex: currentIndex > 2 ? i + startIndex - 2 : 0,
                currentIndex: i + startIndex,
              });
            }}
          >
            {i + startIndex + 1}
          </li>
        );
      }
    }
    return pageList;
  };
  render() {
    const searchProps = {
      mode: this.state.isSearch ? "" : "nav",
      width: "100px",
      height: "35px",
      isNavSearch: this.state.isSearch,
      handleSearchState: this.handleSearchState,
      handleSearchList: this.handleSearchList,
    };

    return (
      <div className="navigation-panel">
        {this.state.isSearch ? (
          <>
            <span
              className="icon-close nav-close-icon"
              onClick={() => {
                this.handleSearchState(false);
                this.props.handleSearch(false);
                this.setState({ searchList: null });
              }}
            ></span>
            <div
              className="header-search-container"
              style={this.state.isSearch ? { left: 40 } : {}}
            >
              <div
                className="navigation-search-title"
                style={{ height: "20px", margin: "0px 25px 13px" }}
              >
                <Trans>Search the book</Trans>
              </div>
              <SearchBox {...searchProps} />
            </div>
            <ul className="nav-search-list">
              {this.state.searchList ? this.renderSearchList() : null}
            </ul>
            <ul className="nav-search-page">
              {this.state.searchList ? this.renderSearchPage() : null}
            </ul>
          </>
        ) : (
          <>
            <div className="navigation-header">
              <img className="book-cover" src={this.state.cover} alt="" />
              <p className="book-title">{this.props.currentBook.name}</p>
              <p className="book-arthur">
                <Trans>Author</Trans>:{" "}
                <Trans>
                  {this.props.currentBook.author
                    ? this.props.currentBook.author
                    : "Unknown Authur"}
                </Trans>
              </p>
              <span className="reading-duration">
                <Trans>Reading Time</Trans>: {Math.floor(this.state.time / 60)}
                &nbsp;
                <Trans>Minute</Trans>
              </span>
              <div className="navigation-search-box">
                <SearchBox {...searchProps} />
              </div>

              <div className="navigation-navigation">
                <span
                  className="book-content-title"
                  onClick={() => {
                    this.handleClick(true);
                  }}
                  style={
                    this.state.isContentShow
                      ? { color: "rgba(112, 112, 112, 1)" }
                      : { color: "rgba(217, 217, 217, 1)" }
                  }
                >
                  <Trans>Content</Trans>
                </span>
                <span
                  className="book-bookmark-title"
                  style={
                    this.state.isContentShow
                      ? { color: "rgba(217, 217, 217, 1)" }
                      : { color: "rgba(112, 112, 112, 1)" }
                  }
                  onClick={() => {
                    this.handleClick(false);
                  }}
                >
                  <Trans>Bookmark</Trans>
                </span>
              </div>
            </div>
            <div className="navigation-body-parent">
              <div className="navigation-body">
                {this.state.isContentShow ? (
                  <ContentList />
                ) : this.props.bookmarks ? (
                  <BookmarkList />
                ) : (
                  <div className="navigation-panel-empty-bookmark">
                    <Trans>Empty</Trans>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default NavigationPanel;
