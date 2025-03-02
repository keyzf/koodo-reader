import React from "react";
import "./searchBox.css";
import OtherUtil from "../../utils/otherUtil";
import { Trans } from "react-i18next";
import { SearchBoxProps } from "./interface";
class SearchBox extends React.Component<SearchBoxProps> {
  componentDidMount() {
    if (this.props.isNavSearch) {
      let searchBox: any = document.querySelector(".header-search-box");
      searchBox && searchBox.focus();
    }
  }
  handleMouse = () => {
    let value = (this.refs.searchBox as any).value;
    if (this.props.isNavSearch) {
      value && this.search(value);
    }
    if (this.props.mode === "nav") {
      this.props.handleSearchState(true);
      return;
    }
    let results = OtherUtil.MouseSearch(this.props.books);
    this.props.handleSearchBooks(results);
    this.props.handleSearch(true);
  };
  handleKey = (event: any) => {
    if (event.keyCode !== 13) {
      return;
    }
    let value = (this.refs.searchBox as any).value;
    if (this.props.isNavSearch) {
      value && this.search(value);
    }
    let results = OtherUtil.KeySearch(event, this.props.books);
    if (results) {
      this.props.handleSearchBooks(results);
      this.props.handleSearch(true);
    }
  };
  search = (q: string) => {
    this.doSearch(q).then((result) => {
      let searchList = result.map((item: any) => {
        item.excerpt = item.excerpt.replace(
          q,
          `<span class="content-search-text">${q}</span>`
        );
        return item;
      });
      // this.$refs.searchInput.blur();
      this.props.handleSearchList(searchList);
    });
  };
  doSearch = (q: string) => {
    return Promise.all(
      this.props.currentEpub.spine.spineItems.map((item: any) =>
        item
          .load(this.props.currentEpub.load.bind(this.props.currentEpub))
          .then(item.find.bind(item, q))
          .finally(item.unload.bind(item))
      )
    ).then((results: any) => Promise.resolve([].concat.apply([], results)));
  };
  handleCancel = () => {
    if (this.props.isNavSearch) {
      this.props.handleSearchList(null);
    }
    this.props.handleSearch(false);
    (document.querySelector(".header-search-box") as HTMLInputElement).value =
      "";
  };

  render() {
    return (
      <div style={{ position: "relative" }}>
        <input
          type="text"
          ref="searchBox"
          className="header-search-box"
          onKeyDown={(event) => {
            this.handleKey(event);
          }}
          onFocus={() => {
            this.props.mode === "nav" && this.props.handleSearchState(true);
          }}
          placeholder="Search"
          style={
            this.props.mode === "nav"
              ? { width: this.props.width, height: this.props.height }
              : { paddingRight: "50px" }
          }
        />
        {this.props.isSearch ? (
          <span
            className="header-search-text"
            onClick={() => {
              this.handleCancel();
            }}
            style={this.props.mode === "nav" ? { right: "-9px" } : {}}
          >
            <Trans>Cancel</Trans>
          </span>
        ) : (
          <span
            className="icon-search header-search-icon"
            onClick={() => {
              this.handleMouse();
            }}
            style={this.props.mode === "nav" ? { right: "5px" } : {}}
          ></span>
        )}
      </div>
    );
  }
}

export default SearchBox;
